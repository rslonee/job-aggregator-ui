// pages/login.js
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function Login() {
  const supabase = useSupabaseClient()

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        magicLink={true}
      />
    </div>
  )
}
