export interface Supplement {
  id: number
  slot: string
  name: string
  dosage: string
  emptyStomach: boolean
  taken: boolean
  time: Date | null
}

export interface DayData {
  date: string // ISO format: YYYY-MM-DD
  supplements: Supplement[]
  completionPercentage: number
}

export type SupplementHistory = Record<string, DayData>

export interface Dose {
  id: number
  date: string
  slot: string
  name: string
  taken: boolean
  time: Date | null
}
