import { NextRequest } from 'next/server'
import { updateServerAuth } from '@supabase/ssr/middleware'

export function middleware(req: NextRequest) {
  return updateServerAuth({ req })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
