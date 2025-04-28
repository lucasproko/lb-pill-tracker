"use client"

import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import SupplementList from "@/components/supplement-list"
import {
  getSupplementHistoryForDate,
  updateSupplementHistoryEntry,
  resetSupplementHistoryForDate,
  SupplementHistoryEntry
} from "@/lib/supplement-utils"

export default function DayPage({ params }: { params: { date: string } }) {
  const { date: dateString } = params
  const router = useRouter()
  const [supplements, setSupplements] = useState<SupplementHistoryEntry[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Format the date for display
  const displayDate = format(parseISO(dateString), "MMMM d, yyyy")

  // Load supplements for this day
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoaded(false)
      try {
        const historyEntries = await getSupplementHistoryForDate(dateString)
        setSupplements(historyEntries)
      } catch (e) {
        console.error("Failed to load supplement history for day:", e)
        setSupplements([])
      } finally {
        setIsLoaded(true)
      }
    }
    fetchHistory()
  }, [dateString])

  // Calculate progress
  const totalSupplements = supplements.length
  const completedSupplements = supplements.filter((s) => s.taken).length
  const progressPercentage = totalSupplements > 0 ? Math.round((completedSupplements / totalSupplements) * 100) : 0

  // Group supplements by time slot
  const morningSupplements = supplements.filter((s) => s.day_slot === "morning")
  const middaySupplements = supplements.filter((s) => s.day_slot === "midday")
  const eveningSupplements = supplements.filter((s) => s.day_slot === "evening")

  // Handle toggling a supplement
  const toggleSupplement = async (entryId: string) => {
    const supplement = supplements.find(s => s.id === entryId)
    if (!supplement) return

    const newTakenStatus = !supplement.taken
    const updates = {
      taken: newTakenStatus,
      taken_at: newTakenStatus ? new Date().toISOString() : null,
    }

    // Optimistic UI update
    setSupplements((prev) =>
      prev.map((s) => (s.id === entryId ? { ...s, ...updates } : s))
    )

    // Update Supabase
    const updatedEntry = await updateSupplementHistoryEntry(entryId, updates)

    if (!updatedEntry) {
      // Revert UI on failure
      console.error("Failed to update supplement status in DB. Reverting UI.")
      setSupplements((prev) =>
        prev.map((s) => (s.id === entryId ? { ...s, taken: supplement.taken, taken_at: supplement.taken_at } : s))
      )
    }
  }

  // Handle updating time
  const updateTime = async (entryId: string, time: Date | null) => {
    console.log("Update time called (not fully implemented):", entryId, time)
    // Optimistic UI update... (if needed)
    // const updatedEntry = await updateSupplementHistoryEntry(entryId, { taken_at: time ? time.toISOString() : null });
    // Handle success/failure...
  }

  // Reset all supplements for this day
  const resetDay = async () => {
    setIsLoaded(false)
    try {
      const resetEntries = await resetSupplementHistoryForDate(dateString)
      setSupplements(resetEntries)
    } catch (e) {
      console.error("Failed to reset day:", e)
      // Optionally refetch current state or show error
    } finally {
      setIsLoaded(true)
    }
  }

  // Go back to calendar view
  const goBack = () => {
    router.push("/")
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading supplements...</p>
      </div>
    )
  }

  return (
    <main className="container mx-auto py-8 px-2">
      <Card className="w-full max-w-3xl mx-auto min-w-[320px]">
        <CardHeader>
          <div className="flex items-center mb-2">
            <Button variant="ghost" size="icon" onClick={goBack} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl">{displayDate}</CardTitle>
          </div>
          <div className="flex justify-between items-center">
            <div className="w-full">
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {completedSupplements} of {totalSupplements} supplements taken ({progressPercentage}%)
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={resetDay} className="ml-4">
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-0">
          <SupplementList
            title="Morning"
            supplements={morningSupplements}
            onToggle={toggleSupplement}
            onTimeChange={updateTime}
          />
          <SupplementList
            title="Mid-day"
            supplements={middaySupplements}
            onToggle={toggleSupplement}
            onTimeChange={updateTime}
          />
          <SupplementList
            title="Evening"
            supplements={eveningSupplements}
            onToggle={toggleSupplement}
            onTimeChange={updateTime}
          />
        </CardContent>
      </Card>
    </main>
  )
}
