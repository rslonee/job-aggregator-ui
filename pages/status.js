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

  useEffect(() => {
    async function loadByStatus() {
      setLoading(true)
      const { data, error } = await supabase
        .from('jobs')
        .select('id,title,company,location,date_posted,status') // include status
        .in('status', ['applied', 'rejected'])
        .order('date_posted', { ascending: false })
      if (error) {
        console.error('Failed to load statuses:', error)
      } else {
        setJobs(data)
      }
      setLoading(false)
    }
    loadByStatus()
  }, [supabase])

  const handleToggle = () => setCollapsed((c) => !c)

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
      field: 'date_posted',
      headerName: 'Date Posted',
      flex: 1,
      type: 'date',
      valueGetter: ({ value }) => new Date(value),
    },
    { field: 'status', headerName: 'Status', flex: 1 }, // show status
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar collapsed={collapsed} onToggle={handleToggle} onAddSite={() => {}} />
      <Box sx={{ flexGrow: 1, p: 2, height: '100vh' }}>
        <Typography variant="h5" gutterBottom>
          Applied & Rejected Jobs
        </Typography>
        <DataGrid
          rows={jobs}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
          pageSize={100}
          rowsPerPageOptions={[100]}
          disableColumnMenu
          disableSelectionOnClick
        />
      </Box>
    </Box>
  )
}
