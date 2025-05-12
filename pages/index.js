import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Home() {
  const session = useSession()
  const router  = useRouter()

  useEffect(() => {
    if (!session) {
      router.replace('/login')   // ← delete or comment out this line
    }
  }, [session, router])

  if (!session) return null   // ← you can also remove this “guard”

  return (
    <div>
      {/* your app’s main UI */}
    </div>
  )
}
