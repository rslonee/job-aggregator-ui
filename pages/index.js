// pages/login.js

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

// Load the Auth UI only on the client
const Auth = dynamic(
  () => import('@supabase/auth-ui-react').then((mod) => mod.Auth),
  { ssr: false }
)

export default function Login() {
  const supabase = useSupabaseClient()
  const session = useSession()
  const router = useRouter()

  // If there's already a session, go home
  useEffect(() => {
    if (session) {
      router.replace('/')
    }
  }, [session, router])

  // Listen for the SIGNED_IN event and redirect
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (event === 'SIGNED_IN') {
          router.replace('/')
        }
      }
    )
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  // Prevent SSR / SSG errors
  if (typeof window === 'undefined') return null

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
      />
    </div>
  )
}
