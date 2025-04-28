"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { TimeInput } from "@/components/time-input"
import type { Dose } from "@/lib/types"
import { toggleDose } from "@/lib/actions"

interface PillItemProps {
  dose: Dose
}

export default function PillItem({ dose }: PillItemProps) {
  const [checked, setChecked] = useState(dose.taken)
  const [time, setTime] = useState<Date | undefined>(dose.time ? new Date(dose.time) : undefined)
  const [isUpdating, setIsUpdating] = useState(false)

  // Load from localStorage on initial render
  useEffect(() => {
    const storedData = localStorage.getItem(`dose-${dose.id}`)
    if (storedData) {
      const { taken, timeStamp } = JSON.parse(storedData)
      setChecked(taken)
      setTime(timeStamp ? new Date(timeStamp) : undefined)
    } else {
      // Initialize with the props if no localStorage data
      setChecked(dose.taken)
      setTime(dose.time ? new Date(dose.time) : undefined)
    }
  }, [dose.id, dose.taken, dose.time])

  // Handle checkbox change
  const handleCheckChange = async (checked: boolean) => {
    setChecked(checked)

    // Set current time if checked and no time exists
    const newTime = checked && !time ? new Date() : time
    setTime(newTime)

    // Save to localStorage
    localStorage.setItem(
      `dose-${dose.id}`,
      JSON.stringify({
        taken: checked,
        timeStamp: newTime ? newTime.toISOString() : null,
      }),
    )

    // Update in database
    setIsUpdating(true)
    try {
      await toggleDose({
        id: dose.id,
        date: dose.date,
        slot: dose.slot,
        name: dose.name,
        taken: checked,
        time: newTime,
      })
    } catch (error) {
      console.error("Failed to update dose:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle time change
  const handleTimeChange = async (newTime: Date | undefined) => {
    setTime(newTime)

    // Save to localStorage
    localStorage.setItem(
      `dose-${dose.id}`,
      JSON.stringify({
        taken: checked,
        timeStamp: newTime ? newTime.toISOString() : null,
      }),
    )

    // Update in database
    setIsUpdating(true)
    try {
      await toggleDose({
        id: dose.id,
        date: dose.date,
        slot: dose.slot,
        name: dose.name,
        taken: checked,
        time: newTime,
      })
    } catch (error) {
      console.error("Failed to update time:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <Checkbox id={`dose-${dose.id}`} checked={checked} onCheckedChange={handleCheckChange} disabled={isUpdating} />
      <TimeInput value={time} onChange={handleTimeChange} disabled={!checked || isUpdating} />
    </div>
  )
}
