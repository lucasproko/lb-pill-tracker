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
            <TableHead className="w-[40%] sm:w-auto">Dosage</TableHead>
            <TableHead className="w-[10%] sm:w-auto px-4">
              <div className="flex items-center justify-end">
                ✅
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supplements && supplements.length > 0 ? (
            supplements.map((entry) => (
              entry && entry.supplements ? (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium align-top py-2">
                    <div>{entry.supplements.name}</div>
                    <div className="text-xs text-muted-foreground">({entry.timing})</div>
                  </TableCell>
                  <TableCell className="align-middle py-2">{`${entry.dosage_scheduled} ${entry.unit_scheduled || ''}`.trim()}</TableCell>
                  <TableCell className="text-left align-middle py-2">
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
              <TableCell colSpan={3} className="text-center text-muted-foreground py-2">
                No supplements scheduled for this time.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
