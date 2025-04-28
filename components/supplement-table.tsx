import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

interface Dose {
  id: number
  date: string
  slot: string
  name: string
  taken: boolean
  time: Date | null
}

interface SupplementTableProps {
  title: string
  doses: Dose[]
}

export default function SupplementTable({ title, doses }: SupplementTableProps) {
  // Find empty stomach items
  const emptyStomachItems = doses.filter((dose) => dose.name.toLowerCase().includes("pyloricil"))

  // Other items
  const regularItems = doses.filter((dose) => !dose.name.toLowerCase().includes("pyloricil"))

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <Table>
        <TableCaption>Take supplements as prescribed</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Supplement</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emptyStomachItems.map((dose) => (
            <TableRow key={dose.id}>
              <TableCell className="font-medium">
                {dose.name} <span className="text-sm text-muted-foreground">(empty stomach)</span>
              </TableCell>
              <TableCell>2 caps</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-4">
                  <Checkbox id={`dose-${dose.id}`} />
                  <span>🕒</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {regularItems.map((dose) => (
            <TableRow key={dose.id}>
              <TableCell className="font-medium">{dose.name}</TableCell>
              <TableCell>
                {dose.name.includes("Enzymes")
                  ? "1 cap"
                  : dose.name.includes("Biocidin")
                    ? "3-15 drops"
                    : dose.name.includes("MegaIgG")
                      ? "1 cap"
                      : dose.name.includes("Akkermansia")
                        ? "1 cap"
                        : dose.name.includes("ProFlora4R")
                          ? "1 cap"
                          : dose.name.includes("GI Revive")
                            ? "1 Tbsp"
                            : "1 cap"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-4">
                  <Checkbox id={`dose-${dose.id}`} />
                  <span>🕒</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
