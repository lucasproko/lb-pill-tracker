import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types' // Import the generated types

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
}
if (!supabaseAnonKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

// Create and export the Supabase client
// Use the Database generic for type safety
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey) 