// pages/_app.js

import '../styles/globals.css'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

export default function App({ Component, pageProps }) {
  // Create a Supabase client with the Next.js auth helpers
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
