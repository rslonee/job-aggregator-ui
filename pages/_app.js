// pages/_app.js

import { useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  // on first render, make sure we only create the client once
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient()
  )

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}

export default MyApp
