// pages/status.js

import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography } from '@mui/material'
import Sidebar from '../components/Sidebar'

export default function StatusPage() {
  const supabase = useSupabaseClient()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)

  // 2) Fetch jobs where applied or reviewed is true
  useEffect(() => {
    async function fetchStatus() {
      setLoading(true)
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          company,
          location,
          url,
          applied,
          reviewed,
          original_posted_date,
          inserted_at
        `)
        .or('applied.eq.true,reviewed.eq.true')
        .order('inserted_at', { ascending: false })

      if (error) console.error('Error loading status:', error)
      else setJobs(data)
      setLoading(false)
    }
    fetchStatus()
  }, [supabase])

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 2,
      renderCell: (params) => (
        <a href={params.row.url} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    { field: 'company', headerName: 'Company', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    {
      field: 'original_posted_date',
      headerName: 'Posted Date',
      flex: 1,
      valueGetter: ({ value }) => value ? new Date(value) : null,
      type: 'date',
    },
    {
      field: 'inserted_at',
      headerName: 'Fetched At',
      flex: 1,
      valueGetter: ({ value }) => new Date(value),
      type: 'dateTime',
    },
    { field: 'applied', headerName: 'Applied', flex: 1, type: 'boolean' },
    { field: 'reviewed', headerName: 'Reviewed', flex: 1, type: 'boolean' },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        onAddSite={() => {}}
      />
      <Box sx={{ flexGrow: 1, p: 2, height: '100vh' }}>
        <Typography variant="h5" gutterBottom>
          Applied & Reviewed Jobs ({jobs.length})
        </Typography>
        <DataGrid
          rows={jobs}
          columns={columns}
          getRowId={(r) => r.id}
          loading={loading}
          pageSize={50}
          rowsPerPageOptions={[50]}
          disableColumnMenu
          disableSelectionOnClick
        />
      </Box>
    </Box>
  )
}
