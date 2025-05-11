import '../styles/globals.css'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function App({ Component, pageProps }) {
  // Use createPagesBrowserClient for client-only pages
  const supabase = createPagesBrowserClient()

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
