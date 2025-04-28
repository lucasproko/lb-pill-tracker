"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { TimeInput } from "./time-input"
import type { SupplementHistoryEntry } from "@/lib/supplement-utils"

interface SupplementItemProps {
  supplementEntry: SupplementHistoryEntry
  onToggle: () => void
  onTimeChange: (time: Date | null) => void
}

export default function SupplementItem({ supplementEntry, onToggle, onTimeChange }: SupplementItemProps) {
  const takenAtDate = supplementEntry.taken_at ? new Date(supplementEntry.taken_at) : null;

  return (
    <div className="flex items-center justify-end space-x-2">
      <Checkbox 
        id={`supplement-${supplementEntry.id}`} 
        checked={supplementEntry.taken ?? false} 
        onCheckedChange={onToggle} 
        aria-label={`Mark ${supplementEntry.supplements?.name || 'supplement'} as taken`}
      />
      {/* <TimeInput value={takenAtDate} onChange={onTimeChange} disabled={!supplementEntry.taken} /> */}
    </div>
  )
}
