// pages/index.js

import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function Home() {
  const supabase = useSupabaseClient()
  const [jobs, setJobs] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAll() {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
      console.log('ALL JOBS:', data, 'ERROR:', error)
      setJobs(data || [])
      setError(error)
    }
    fetchAll()
  }, [supabase])

  return (
    <div style={{ padding: 20 }}>
      <h1>Debug: All Jobs ({jobs.length})</h1>
      {error && (
        <pre style={{ color: 'red' }}>
          Supabase Error: {JSON.stringify(error, null, 2)}
        </pre>
      )}
      <pre style={{ whiteSpace: 'pre-wrap', background: '#eee', padding: 10 }}>
        {JSON.stringify(jobs, null, 2)}
      </pre>
    </div>
  )
}
