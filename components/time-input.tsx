"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { format, parse } from "date-fns"

interface TimeInputProps {
  value: Date | null
  onChange: (time: Date | null) => void
  disabled?: boolean
}

export function TimeInput({ value, onChange, disabled = false }: TimeInputProps) {
  const [timeString, setTimeString] = useState<string>("")

  // Update time string when value changes
  useEffect(() => {
    if (value) {
      try {
        setTimeString(format(value, "HH:mm"))
      } catch (e) {
        console.error("Error formatting date:", e)
        setTimeString("")
      }
    } else {
      setTimeString("")
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTimeString = e.target.value
    setTimeString(newTimeString)

    // Parse time string to Date
    if (newTimeString) {
      try {
        // Create a date with today's date and the input time
        const today = new Date()
        const dateString = format(today, "yyyy-MM-dd")
        const newDate = parse(`${dateString} ${newTimeString}`, "yyyy-MM-dd HH:mm", new Date())
        onChange(newDate)
      } catch (error) {
        console.error("Invalid time format:", error)
      }
    } else {
      onChange(null)
    }
  }

  return (
    <div className="flex items-center">
      <span className="mr-2">🕒</span>
      <Input type="time" value={timeString} onChange={handleChange} disabled={disabled} className="w-24" />
    </div>
  )
}
