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

  // Fetch only jobs where applied OR rejected is true
  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('jobs')
        .select('id,title,company,location,url,applied,rejected,date_posted,inserted_at')
        .or('applied.eq.true,rejected.eq.true')
        .order('inserted_at', { ascending: false })

      if (error) console.error(error)
      else setJobs(data)
      setLoading(false)
    }
    load()
  }, [supabase])

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 2,
      renderCell: ({ row, value }) => (
        <a href={row.url} target="_blank" rel="noopener noreferrer">{value}</a>
      ),
    },
    { field: 'company', headerName: 'Company', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    {
      field: 'date_posted',
      headerName: 'Posted',
      type: 'date',
      valueGetter: ({ value }) => new Date(value),
      flex: 1,
    },
    {
      field: 'inserted_at',
      headerName: 'Fetched',
      type: 'dateTime',
      valueGetter: ({ value }) => new Date(value),
      flex: 1,
    },
    { field: 'applied', headerName: 'Applied', type: 'boolean', flex: 1 },
    { field: 'rejected', headerName: 'Rejected', type: 'boolean', flex: 1 },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        onAddSite={() => {}}
      />
      <Box sx={{ flexGrow: 1, p: 2, height: '100vh' }}>
        <Typography variant="h5" gutterBottom>
          Applied & Rejected ({jobs.length})
        </Typography>
        <DataGrid
          rows={jobs}
          columns={columns}
          getRowId={r => r.id}
          loading={loading}
          pageSize={50}
          rowsPerPageOptions={[50]}
          disableSelectionOnClick
          autoHeight
        />
      </Box>
    </Box>
  )
}
