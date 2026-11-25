import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null =
  isSupabaseConfigured && url && anonKey ? createClient(url, anonKey) : null

/**
 * Where the data lives, honestly:
 * - If VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set, the store tries
 *   Supabase first (tables in supabase/schema.sql) and falls back to
 *   localStorage when the network / project is unavailable.
 * - If they are not set, everything runs on localStorage in this browser
 *   (fully working demo / offline mode). Nothing is silently lost: the
 *   Settings page in Admin shows which mode is active.
 * Never put the service-role key in frontend code — it belongs only in
 * Supabase Edge Functions / server code (see supabase/functions/).
 */
export function storageMode(): 'supabase' | 'local' {
  return isSupabaseConfigured ? 'supabase' : 'local'
}
