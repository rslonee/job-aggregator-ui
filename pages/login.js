// pages/login.js

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

const Auth = dynamic(
  () => import('@supabase/auth-ui-react').then((m) => m.Auth),
  { ssr: false }
)

export default function Login() {
  const supabase = useSupabaseClient()
  const session  = useSession()
  const router   = useRouter()

  // If already signed in, go home
  useEffect(() => {
    if (session) router.replace('/')
  }, [session, router])

  if (typeof window === 'undefined') return null

  // Your production URL
  const APP = process.env.NEXT_PUBLIC_APP_URL || 'https://job-aggregator-ui.vercel.app'

  return (
    <div style={{
      maxWidth: '400px',
      margin:   '5% auto',
      padding:  '1rem',
      border:   '1px solid #eee',
      borderRadius: '8px'
    }}>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['github']}
        // redirect to your homepage instead of the callback route
        redirectTo={`${APP}/`}
      />
    </div>
  )
}
