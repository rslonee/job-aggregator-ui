// pages/_app.js
import { SessionContextProvider } from '@supabase/ssr/react'
import { createBrowserSupabase }    from '../utils/supabase/browser'

export default function App({ Component, pageProps }) {
  const supabase = createBrowserSupabase()

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
