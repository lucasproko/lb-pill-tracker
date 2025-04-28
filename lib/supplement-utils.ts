import { differenceInWeeks, startOfDay } from 'date-fns';
import { supabase } from './supabaseClient'; // Import the Supabase client
import type { Database } from './database.types'; // Import generated types

// Define the specific types we expect from Supabase queries
// Adjust based on actual data needed in components
export type SupplementScheduleItem = Database['public']['Tables']['schedule']['Row'] & {
  supplements: Pick<Database['public']['Tables']['supplements']['Row'], 'id' | 'name' | 'default_unit'> | null;
};

export type SupplementHistoryEntry = Database['public']['Tables']['history']['Row'] & {
  supplements: Pick<Database['public']['Tables']['supplements']['Row'], 'id' | 'name' | 'default_unit'> | null;
};

// --- Helper Function to Determine Week Number ---
const START_DATE = new Date('2025-04-28T00:00:00'); // Your specified start date

function getWeekNumber(currentDate: Date): number {
  const weeksSinceStart = differenceInWeeks(startOfDay(currentDate), startOfDay(START_DATE));
  if (weeksSinceStart < 0) return 1; // Handle dates before start date if necessary
  if (weeksSinceStart === 0) return 1; // Week 1
  if (weeksSinceStart === 1) return 2; // Week 2
  return 3; // Week 3 and onwards
}

// --- Fetch Scheduled Supplements for a Given Date ---
// Replaces the old getDefaultSupplements logic
export async function getScheduledSupplementsForDate(date: Date): Promise<SupplementScheduleItem[]> {
  const weekNumber = getWeekNumber(date);

  const { data, error } = await supabase
    .from('schedule')
    .select(`
      *,
      supplements ( id, name, default_unit )
    `)
    .eq('week_number', weekNumber)
    .order('day_slot', { ascending: true }) // Optional: order by slot
    .order('timing', { ascending: true }); // Optional: order by timing within slot

  if (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }

  // Filter out null supplements just in case join fails unexpectedly
  return (data || []).filter(item => item.supplements !== null);
}

// --- Fetch or Create Supplement History for a Given Date ---
export async function getSupplementHistoryForDate(dateString: string): Promise<SupplementHistoryEntry[]> {
  const targetDate = startOfDay(new Date(dateString + 'T00:00:00')); // Ensure consistent date obj

  // 1. Check if history already exists for this date
  const { data: existingHistory, error: fetchError } = await supabase
    .from('history')
    .select(`
      *,
      supplements ( id, name, default_unit )
    `)
    .eq('taken_date', dateString);

  if (fetchError) {
    console.error('Error fetching history:', fetchError);
    return []; // Return empty on error
  }

  if (existingHistory && existingHistory.length > 0) {
    console.log(`History found for ${dateString}`);
    return existingHistory.filter(item => item.supplements !== null); // Return existing data
  }

  // 2. If no history, fetch the schedule for that day and create entries
  console.log(`No history for ${dateString}, creating from schedule...`);
  const scheduleForDay = await getScheduledSupplementsForDate(targetDate);

  if (!scheduleForDay || scheduleForDay.length === 0) {
    console.warn(`No schedule found for ${dateString} (Week ${getWeekNumber(targetDate)}) to create history.`);
    return [];
  }

  const historyToInsert = scheduleForDay.map(item => ({
    supplement_id: item.supplement_id,
    taken_date: dateString,
    day_slot: item.day_slot,
    timing: item.timing,
    dosage_scheduled: item.dosage,
    // Assuming supplement join worked in getScheduledSupplementsForDate
    unit_scheduled: item.supplements!.default_unit,
    taken: false, // Default to not taken
    // Add notes if needed: notes: item.notes
  }));

  const { data: insertedHistory, error: insertError } = await supabase
    .from('history')
    .insert(historyToInsert)
    .select(`
      *,
      supplements ( id, name, default_unit )
    `); // Select after insert to get full data back

  if (insertError) {
    // Handle potential race condition if another process inserted just now
    if (insertError.code === '23505') { // Unique constraint violation
       console.warn(`History insert failed due to existing entry for ${dateString}, refetching...`);
       // Refetch the data that must now exist
        const { data: refetchedHistory, error: refetchError } = await supabase
            .from('history')
            .select(`*, supplements ( id, name, default_unit )`)
            .eq('taken_date', dateString);
        if (refetchError) {
            console.error('Error refetching history after insert conflict:', refetchError);
            return [];
        }
        return (refetchedHistory || []).filter(item => item.supplements !== null);
    } else {
      console.error('Error inserting history:', insertError);
      return [];
    }
  }

  return (insertedHistory || []).filter(item => item.supplements !== null);
}


// --- Update a Single Supplement History Entry ---
// Replaces the bulk saveSupplementHistory logic for toggling/timing
export async function updateSupplementHistoryEntry(
  entryId: string, // The UUID of the history row
  updates: Partial<Database['public']['Tables']['history']['Update']>
): Promise<SupplementHistoryEntry | null> {

  const { data, error } = await supabase
    .from('history')
    .update(updates)
    .eq('id', entryId)
    .select(`
      *,
      supplements ( id, name, default_unit )
    `)
    .single(); // Expecting only one row back

  if (error) {
    console.error('Error updating history entry:', error);
    return null;
  }

  return data;
}

// --- Reset Supplement History for a Given Date ---
// Creates new entries based on schedule, effectively overwriting/resetting
export async function resetSupplementHistoryForDate(dateString: string): Promise<SupplementHistoryEntry[]> {
    const targetDate = startOfDay(new Date(dateString + 'T00:00:00'));
    console.log(`Resetting history for ${dateString}...`);

    // 1. Delete existing history entries for the date
    const { error: deleteError } = await supabase
        .from('history')
        .delete()
        .eq('taken_date', dateString);

    if (deleteError) {
        console.error('Error deleting existing history for reset:', deleteError);
        // Decide if you want to proceed or return empty
        // return [];
    }

     // 2. Fetch the schedule and create new entries (similar to getSupplementHistoryForDate)
    const scheduleForDay = await getScheduledSupplementsForDate(targetDate);
    if (!scheduleForDay || scheduleForDay.length === 0) {
        console.warn(`No schedule found for ${dateString} (Week ${getWeekNumber(targetDate)}) to create history during reset.`);
        return [];
    }

    const historyToInsert = scheduleForDay.map(item => ({
        supplement_id: item.supplement_id,
        taken_date: dateString,
        day_slot: item.day_slot,
        timing: item.timing,
        dosage_scheduled: item.dosage,
        unit_scheduled: item.supplements!.default_unit,
        taken: false,
    }));

    const { data: insertedHistory, error: insertError } = await supabase
        .from('history')
        .insert(historyToInsert)
        .select(`*, supplements ( id, name, default_unit )`);

    if (insertError) {
        console.error('Error inserting history during reset:', insertError);
        return [];
    }

    return (insertedHistory || []).filter(item => item.supplements !== null);
}

// --- Example function to get calendar overview (completion status) ---
// Replaces the old getSupplementHistory for the calendar view
export async function getCalendarHistoryOverview(): Promise<Record<string, { completionPercentage: number }>> {
  const { data, error } = await supabase
    .from('history')
    .select('taken_date, taken');

  if (error) {
    console.error('Error fetching calendar overview:', error);
    return {};
  }

  const overview: Record<string, { total: number; completed: number }> = {};

  (data || []).forEach(entry => {
    const dateStr = entry.taken_date;
    if (!dateStr) return; // Skip if date is null

    if (!overview[dateStr]) {
      overview[dateStr] = { total: 0, completed: 0 };
    }
    overview[dateStr].total++;
    if (entry.taken) {
      overview[dateStr].completed++;
    }
  });

  const result: Record<string, { completionPercentage: number }> = {};
  for (const dateStr in overview) {
    const { total, completed } = overview[dateStr];
    result[dateStr] = {
      completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }

  return result;
}
