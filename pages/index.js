// pages/index.js

import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography, Button } from '@mui/material'
import Sidebar from '../components/Sidebar'

export default function Home() {
  const supabase = useSupabaseClient()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)

  // 1) Fetch jobs where neither applied nor reviewed is true
  useEffect(() => {
    async function fetchJobs() {
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
        .not('applied', 'eq', true)
        .not('reviewed', 'eq', true)
        .order('inserted_at', { ascending: false })

      if (error) console.error('Error loading jobs:', error)
      else setJobs(data)
      setLoading(false)
    }
    fetchJobs()
  }, [supabase])

  // Update flags and remove row locally
  const mark = async (id, isApplied) => {
    await supabase
      .from('jobs')
      .update({ applied: isApplied, reviewed: !isApplied })
      .eq('id', id)
    setJobs((prev) => prev.filter((j) => j.id !== id))
  }

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
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <Button
            size="small"
            variant="outlined"
            onClick={() => mark(params.row.id, true)}
            sx={{ mr: 1 }}
          >
            Applied
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => mark(params.row.id, false)}
          >
            Reviewed
          </Button>
        </>
      ),
    },
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
          New Jobs ({jobs.length})
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
