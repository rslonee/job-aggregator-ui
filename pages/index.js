// pages/index.js

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  useSession,
  useSupabaseClient,
} from '@supabase/auth-helpers-react'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Box, Typography } from '@mui/material'

export default function Home() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()

  // Redirect to /login if not authenticated
  useEffect(() => {
    if (session === null) {
      router.replace('/login')
    }
  }, [session, router])

  // While we’re checking session, don’t flash UI
  if (!session) {
    return null
  }

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch jobs from your Supabase table once session is ready
  useEffect(() => {
    async function loadJobs() {
      setLoading(true)
      let { data, error } = await supabase
        .from('jobs')
        .select('id,title,company,location,date_posted,url')
        .order('date_posted', { ascending: false })
      if (!error) setJobs(data)
      setLoading(false)
    }
    loadJobs()
  }, [supabase])

  // Sign out button
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  // Define columns for the DataGrid
  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 2,
      renderCell: (params) => (
        <a
          href={params.row.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {params.value}
        </a>
      ),
    },
    { field: 'company', headerName: 'Company', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    {
      field: 'date_posted',
      headerName: 'Date Posted',
      flex: 1,
      type: 'date',
      valueGetter: ({ value }) => new Date(value),
    },
  ]

  return (
    <Box sx={{ height: '100vh', p: 2 }}>
      <Box
        sx={{
          display:      'flex',
          justifyContent: 'space-between',
          alignItems:   'center',
          mb:           2,
        }}
      >
        <Typography variant="h5">
          Jobs ({jobs.length})
        </Typography>
        <Button variant="outlined" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Box>

      <DataGrid
        rows={jobs}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        pageSize={100}
        rowsPerPageOptions={[100, { value: jobs.length, label: 'All' }]}
        disableColumnMenu
        disableSelectionOnClick
        hideFooterSelectedRowCount
        sx={{
          '& .MuiDataGrid-row:nth-of-type(odd)': {
            backgroundColor: 'rgba(0,0,0,0.04)',
          },
        }}
      />
    </Box>
  )
}
