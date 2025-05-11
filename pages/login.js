import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react'

export default function Login() {
  const supabase = useSupabaseClient()
  const session = useSession()
  const router = useRouter()

  // If already logged in, redirect home
  useEffect(() => {
    if (session) {
      router.replace('/')
    }
  }, [session, router])

  return (
    <div
      style={{
        maxWidth:  '400px',
        margin:    '5% auto',
        padding:   '1rem',
        border:    '1px solid #eee',
        borderRadius: '8px',
      }}
    >
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['github']}
        redirectTo={typeof window !== 'undefined' ? window.location.origin : undefined}
      />
    </div>
  )
}
