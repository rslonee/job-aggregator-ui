// pages/index.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography, Button } from '@mui/material'
import Sidebar from '../components/Sidebar'

export default function Home() {
  const supabase = useSupabaseClient()
  const router = useRouter()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch jobs
  useEffect(() => {
    async function loadJobs() {
      setLoading(true)
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('date_posted', { ascending: false })
      if (!error) setJobs(data)
      setLoading(false)
    }
    loadJobs()
  }, [supabase])

  const handleStatusUpdate = async (id, status) => {
    await supabase
      .from('jobs')
      .update({ status })
      .eq('id', id)
    setJobs(jobs.map(j => j.id === id ? { ...j, status } : j))
  }

  const columns = [
    { field: 'title', headerName: 'Title', flex: 2 },
    { field: 'company', headerName: 'Company', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    {
      field: 'actions', headerName: 'Status', flex: 1, renderCell: params => (
        <>
          <Button
            size="small"
            variant={params.row.status === 'applied' ? 'contained' : 'outlined'}
            onClick={() => handleStatusUpdate(params.row.id, 'applied')}
            sx={{ mr: 1 }}
          >Applied</Button>
          <Button
            size="small"
            variant={params.row.status === 'rejected' ? 'contained' : 'outlined'}
            color="error"
            onClick={() => handleStatusUpdate(params.row.id, 'rejected')}
          >Rejected</Button>
        </>
      )
    },
  ]

  const handleAddSite = () => {
    // existing add-site logic or open modal
    console.log('Add site clicked')
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar onAddSite={handleAddSite} />
      <Box sx={{ flexGrow: 1, p: 2, height: '100vh' }}>
        <Typography variant="h5" gutterBottom>
          Jobs ({jobs.length})
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
