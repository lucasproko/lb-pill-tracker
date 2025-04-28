export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      // Minimal definition for other potential tables (add more if needed)
      activities: {
        Row: { [key: string]: any }
        Insert: { [key: string]: any }
        Update: { [key: string]: any }
        Relationships: []
      }
      users: {
        Row: { id: string; [key: string]: any }
        Insert: { id: string; [key: string]: any }
        Update: { id?: string; [key: string]: any }
        Relationships: []
      }
      // ... other potential tables ...

      history: {
        Row: {
          created_at: string
          day_slot: string
          dosage_scheduled: number
          id: string
          supplement_id: string
          taken: boolean | null
          taken_at: string | null
          taken_date: string
          timing: string // Allowed values defined by check constraint
          unit_scheduled: string | null
        }
        Insert: {
          created_at?: string
          day_slot: string
          dosage_scheduled: number
          id?: string
          supplement_id: string
          taken?: boolean | null
          taken_at?: string | null
          taken_date: string
          timing: string
          unit_scheduled?: string | null
        }
        Update: {
          created_at?: string
          day_slot?: string
          dosage_scheduled?: number
          id?: string
          supplement_id?: string
          taken?: boolean | null
          taken_at?: string | null
          taken_date?: string
          timing?: string
          unit_scheduled?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "history_supplement_id_fkey"
            columns: ["supplement_id"]
            isOneToOne: false
            referencedRelation: "supplements"
            referencedColumns: ["id"]
          },
        ]
      }

      push_subscriptions: {
        Row: {
          id: string
          created_at: string
          subscription: Json
          endpoint: string
          // user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          subscription: Json
          endpoint: string
          // user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          subscription?: Json
          endpoint?: string
          // user_id?: string | null
        }
        Relationships: [
          // Uncomment if user_id FK is added
          // {
          //   foreignKeyName: "push_subscriptions_user_id_fkey"
          //   columns: ["user_id"]
          //   isOneToOne: false
          //   referencedRelation: "users"
          //   referencedColumns: ["id"]
          // }
        ]
      }

      schedule: {
        Row: {
          created_at: string
          day_slot: string
          dosage: number
          id: string
          notes: string | null
          supplement_id: string
          timing: string // Allowed values defined by check constraint
          week_number: number
        }
        Insert: {
          created_at?: string
          day_slot: string
          dosage: number
          id?: string
          notes?: string | null
          supplement_id: string
          timing: string
          week_number: number
        }
        Update: {
          created_at?: string
          day_slot?: string
          dosage?: number
          id?: string
          notes?: string | null
          supplement_id?: string
          timing?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "schedule_supplement_id_fkey"
            columns: ["supplement_id"]
            isOneToOne: false
            referencedRelation: "supplements"
            referencedColumns: ["id"]
          },
        ]
      }

      supplements: {
        Row: {
          created_at: string
          default_unit: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          default_unit?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          default_unit?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }

    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// --- Standard Supabase Helper Types (Do Not Modify) ---

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (
        Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"]
      )
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (
      Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"]
    )[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
    ? (
        PublicSchema["Tables"] &
        PublicSchema["Views"]
      )[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
