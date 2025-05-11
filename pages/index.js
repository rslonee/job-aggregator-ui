// pages/login.js

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

// Dynamically load the Auth UI on the client only
const Auth = dynamic(
  () => import('@supabase/auth-ui-react').then((mod) => mod.Auth),
  { ssr: false }
)

export default function Login() {
  const supabase = useSupabaseClient()
  const session = useSession()
  const router = useRouter()

  // If already logged in, send to home
  useEffect(() => {
    if (session) {
      router.replace('/')
    }
  }, [session, router])

  // Prevent any server‐side render of Auth
  if (typeof window === 'undefined') {
    return null
  }

  // Your production URL – set this as a Vercel env var:
  // NEXT_PUBLIC_APP_URL=https://job-aggregator-ui.vercel.app
  const redirectTo = process.env.NEXT_PUBLIC_APP_URL || 'https://job-aggregator-ui.vercel.app'

  return (
    <div
      style={{
        maxWidth:     '400px',
        margin:       '5% auto',
        padding:      '1rem',
        border:       '1px solid #eee',
        borderRadius: '8px',
      }}
    >
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['github']}
        // FORCE redirect to production URL
        redirectTo={redirectTo}
      />
    </div>
  )
}
