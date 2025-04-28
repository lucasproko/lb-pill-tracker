"use client"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import SupplementItem from "./supplement-item"
import type { SupplementHistoryEntry } from "@/lib/supplement-utils"

interface SupplementListProps {
  title: string
  supplements: SupplementHistoryEntry[]
  onToggle: (id: string) => void
  onTimeChange: (id: string, time: Date | null) => void
}

export default function SupplementList({ title, supplements, onToggle, onTimeChange }: SupplementListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%] sm:w-[300px]">Supplement</TableHead>
            <TableHead className="w-[25%] sm:w-auto">Dosage</TableHead>
            <TableHead className="text-right w-[25%] sm:w-auto">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supplements && supplements.length > 0 ? (
            supplements.map((entry) => (
              entry && entry.supplements ? (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {entry.supplements.name}
                    <span className="text-sm text-muted-foreground ml-1">({entry.timing})</span>
                  </TableCell>
                  <TableCell>{`${entry.dosage_scheduled} ${entry.unit_scheduled || ''}`.trim()}</TableCell>
                  <TableCell className="text-right">
                    <SupplementItem
                      supplementEntry={entry}
                      onToggle={() => onToggle(entry.id)}
                      onTimeChange={(time) => onTimeChange(entry.id, time)}
                    />
                  </TableCell>
                </TableRow>
              ) : null
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No supplements scheduled for this time.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
