// pages/login.js
import { Auth } from '@supabase/ssr-auth-ui'
import { createBrowserSupabase } from '../utils/supabase/browser'

const supabase = createBrowserSupabase()

export default function Login() {
  return (
    <div style={{ display:'flex',justifyContent:'center',alignItems:'center',height:'100vh' }}>
      <Auth supabaseClient={supabase} />
    </div>
  )
}
