import { createServerClient } from '@supabase/ssr'

export function createServerSupabase(cookies) {
  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { cookies }
  )
}
