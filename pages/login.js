import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

// Dynamically load the Auth UI on the client only
const Auth = dynamic(
  () => import('@supabase/auth-ui-react').then(mod => mod.Auth),
  { ssr: false }
)

export default function Login() {
  const supabase = useSupabaseClient()
  const session = useSession()
  const router = useRouter()

  // Redirect to home once logged in
  useEffect(() => {
    if (session) router.replace('/')
  }, [session, router])

  // Prevent SSG errors by rendering nothing on the server
  if (typeof window === 'undefined') return null

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
        redirectTo={window.location.origin}
      />
    </div>
  )
}
