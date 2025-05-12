// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  // create the Supabase CLient passing in the request
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // e.g. enforce authentication on /dashboard/*
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    // redirect to login if no session
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  return res
}

// which routes should be protected by this middleware?
export const config = {
  matcher: ['/dashboard/:path*'],
}
