// pages/_app.js
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider }    from '@supabase/auth-helpers-react'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  const supabase = createBrowserSupabaseClient()

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
