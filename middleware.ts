// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Apply to every path
export const config = { matcher: ['/:path*'] }

export function middleware(req: NextRequest) {
  const auth = req.headers.get('authorization') || ''
  const [, b64] = auth.split(' ')
  const [user, pass] = b64 ? atob(b64).split(':') : []

  // Compare against your Vercel env vars
  if (
    user !== process.env.BASIC_AUTH_USER ||
    pass !== process.env.BASIC_AUTH_PASS
  ) {
    return new Response('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Protected"' },
    })
  }

  // Credentials match → proceed
  return NextResponse.next()
}
