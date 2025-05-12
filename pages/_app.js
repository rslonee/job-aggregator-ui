// pages/_app.js

import { useRef } from 'react'
import { SessionContextProvider, createPagesBrowserClient } from '@supabase/ssr'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  // Create the Supabase client once per session
  const supabase = useRef()
  if (!supabase.current) {
    supabase.current = createPagesBrowserClient()
  }

  return (
    <SessionContextProvider
      supabaseClient={supabase.current}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
