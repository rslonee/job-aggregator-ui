// pages/status.js
import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography, Button } from '@mui/material'
import Sidebar from '../components/Sidebar'
import AddSiteModal from '../components/AddSiteModal'

export default function StatusPage() {
  const supabase = useSupabaseClient()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('jobs')
        .select('id,title,company,location,url,applied,rejected,date_posted,inserted_at')
        .or('applied.eq.true,rejected.eq.true')
        .order('inserted_at', { ascending: false })
      setJobs(data || [])
      setLoading(false)
    }
    load()
  }, [supabase])

  const columns = [
    { field: 'title', headerName: 'Title', flex: 2, renderCell: ({ row }) =>
        <a href={row.url} target="_blank" rel="noopener">{row.title}</a>
    },
    { field: 'company', headerName: 'Company', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'date_posted', headerName: 'Posted', type: 'date',
      valueGetter: ({ value }) => new Date(value), flex: 1 },
    { field: 'inserted_at', headerName: 'Fetched', type: 'dateTime',
      valueGetter: ({ value }) => new Date(value), flex: 1 },
    { field: 'applied', headerName: 'Applied', type: 'boolean', flex: 1 },
    { field: 'rejected', headerName: 'Rejected', type: 'boolean', flex: 1 },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Applied & Rejected ({jobs.length})</Typography>
          <Button variant="contained" onClick={() => setModalOpen(true)}>Add Site</Button>
        </Box>
        <DataGrid
          rows={jobs} columns={columns}
          getRowId={r => r.id} loading={loading}
          pageSize={50} rowsPerPageOptions={[50]}
          autoHeight disableSelectionOnClick
        />
        <AddSiteModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </Box>
    </Box>
  )
}
