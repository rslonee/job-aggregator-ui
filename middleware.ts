// middleware.ts

import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // This will read/set the Supabase auth cookie
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()

  return res
}

// (Optional) apply to all routes except static assets
export const config = {
  matcher: ['/((?!_next/static).*)'],
}
