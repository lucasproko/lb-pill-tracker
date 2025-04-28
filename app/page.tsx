"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { getCalendarHistoryOverview } from "@/lib/supplement-utils"
import "./calendar-fixes.css" // Import the CSS fixes

// Define type for the overview data state
type CalendarOverview = Record<string, { completionPercentage: number }>;

export default function Home() {
  // State for the UI (client-side only)
  const [currentMonth, setCurrentMonth] = useState<Date | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Data states
  const [calendarOverview, setCalendarOverview] = useState<CalendarOverview>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  // Initialize client-side state
  useEffect(() => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  }, []);

  // Load calendar overview data
  useEffect(() => {
    const fetchOverview = async () => {
      setIsLoaded(false);
      try {
        const overview = await getCalendarHistoryOverview();
        setCalendarOverview(overview);
      } catch (e) {
        console.error("Failed to load calendar overview:", e);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchOverview();
  }, []);

  // Day selection handler - separate from month navigation
  const handleDaySelect = (day: Date | undefined) => {
    console.log("handleDaySelect called with:", day);

    let dateToNavigate: Date | undefined = undefined;

    if (day) {
      // If a valid day is passed (new selection), use it
      try {
        const validDate = new Date(day);
        if (isNaN(validDate.getTime())) {
          console.error("Invalid date object received:", day);
          return;
        }
        setSelectedDate(validDate);
        dateToNavigate = validDate;
      } catch (e) {
        console.error("Error processing selected date:", e);
        return;
      }
    } else {
      // If day is undefined (likely clicked the already selected date)
      console.log("Day is undefined - likely clicked the currently selected date.");
      // Use the date currently held in state
      if (selectedDate) {
        dateToNavigate = selectedDate;
      } else {
        console.log("No date currently selected in state, cannot navigate.");
        return; // Cannot navigate if nothing was selected previously
      }
    }

    // Proceed with navigation if we have a valid date
    if (dateToNavigate) {
      try {
        const dateString = format(dateToNavigate, "yyyy-MM-dd");
        console.log(`Navigating to day view: ${dateString}`);
        router.push(`/day/${dateString}`);
      } catch (e) {
        console.error("Error during navigation:", e);
      }
    } else {
      console.error("Could not determine date to navigate to.");
    }
  };

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    if (!currentMonth) return;
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const goToNextMonth = () => {
    if (!currentMonth) return;
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  // Today button just updates the current view month and selected date
  const goToToday = () => {
    const today = new Date();
    console.log("goToToday: Setting current month and selected date to today:", today);
    
    // Update the view to show the current month
    setCurrentMonth(today);
    
    // Update the selected state to today
    setSelectedDate(today);
    
    // // Remove direct navigation - let handleDaySelect handle it if the user clicks the date
    // const dateString = format(today, "yyyy-MM-dd");
    // console.log(`Navigating to today's view: ${dateString}`);
    // router.push(`/day/${dateString}`);
  };

  // Calculate modifiers for calendar day styling
  const dayModifiers: Record<string, Date[]> = {
    completed: [],
    partial: [],
  };

  // Populate modifiers from data
  Object.keys(calendarOverview).forEach((dateString) => {
    const overviewData = calendarOverview[dateString];
    try {
      const dt = new Date(dateString + "T00:00:00");
      if (overviewData && dt instanceof Date && !isNaN(dt.getTime())) {
        if (overviewData.completionPercentage === 100) {
          dayModifiers.completed.push(dt);
        } else if (overviewData.completionPercentage > 0) {
          dayModifiers.partial.push(dt);
        }
      }
    } catch (e) {
      console.warn(`Invalid date string: ${dateString}`);
    }
  });

  // Class names for the day states
  const modifierClassNames = {
    completed: "bg-green-100 dark:bg-green-900/30 rounded-full",
    partial: "bg-yellow-100 dark:bg-yellow-900/30 rounded-full",
    today: "font-bold border-2 border-primary rounded-full"
  };

  // Loading or not yet client-side
  if (!currentMonth || !isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading calendar...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Supplement Tracker</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={goToToday}
                // Add explicit type to help debugging
                type="button" // Keep type="button" to prevent form submission if ever inside a form
                className="px-4"
              >
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="calendar-container">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDaySelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border calendar-component" 
              modifiers={dayModifiers}
              modifiersClassNames={modifierClassNames}
            />
            <div className="mt-6 flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm">Partial</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full border border-gray-300 mr-2"></div>
                <span className="text-sm">No data</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
