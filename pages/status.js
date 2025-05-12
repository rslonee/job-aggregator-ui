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

  useEffect(() => {
    async function loadByStatus() {
      setLoading(true)
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .in('status', ['applied', 'rejected'])
        .order('date_posted', { ascending: false })
      if (!error) setJobs(data)
      setLoading(false)
    }
    loadByStatus()
  }, [supabase])

  const columns = [
    { field: 'title', headerName: 'Title', flex: 2 },
    { field: 'company', headerName: 'Company', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar onAddSite={() => {}} />
      <Box sx={{ flexGrow: 1, p: 2, height: '100vh' }}>
        <Typography variant="h5" gutterBottom>
          Applied & Rejected Jobs
        </Typography>
        <DataGrid
          rows={jobs}
          columns={columns}
          getRowId={row => row.id}
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
