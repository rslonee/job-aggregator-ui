// pages/index.js
import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography, Button } from '@mui/material'
import Sidebar from '../components/Sidebar'
import AddSiteModal from '../components/AddSiteModal'

export default function Home() {
  const supabase = useSupabaseClient()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const loadJobs = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('jobs')
      .select('id,title,company,location,url,applied,rejected,date_posted')
      .not('applied','eq',true)
      .not('rejected','eq',true)
      .order('date_posted', { ascending: false })
    setJobs(data || [])
    setLoading(false)
  }

  useEffect(() => { loadJobs() }, [supabase])

  const mark = async (id, isApplied) => {
    await supabase
      .from('jobs')
      .update({ applied: isApplied, rejected: !isApplied })
      .eq('id', id)
    setJobs(j => j.filter(x => x.id !== id))
  }

  const rejectOld = async () => {
    const threshold = new Date()
    threshold.setDate(threshold.getDate() - 30)
    const iso = threshold.toISOString().split('T')[0]
    await supabase
      .from('jobs')
      .update({ rejected: true })
      .lte('date_posted', iso)
      .not('rejected','eq',true)
      .not('applied','eq',true)
    await loadJobs()
  }

  const columns = [
    {
      field: 'title', headerName: 'Title', flex: 2,
      renderCell: ({ row }) => (
        <a href={row.url} target="_blank" rel="noopener">{row.title}</a>
      ),
    },
    { field: 'company', headerName: 'Company', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    {
      field: 'date_posted', headerName: 'Posted', type: 'date',
      valueGetter: ({ value }) => new Date(value), flex: 1
    },
    {
      field: 'actions', headerName: 'Actions', flex: 1,
      renderCell: ({ row }) => (
        <>
          <Button size="small" onClick={() => mark(row.id, true)}>Applied</Button>
          <Button size="small" color="error" onClick={() => mark(row.id, false)}>Rejected</Button>
        </>
      ),
    },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Box
          sx={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2
          }}
        >
          <Typography variant="h5">New Jobs ({jobs.length})</Typography>
          <Box>
            <Button variant="outlined" sx={{ mr: 1 }} onClick={rejectOld}>
              Reject 30+ Days
            </Button>
            <Button variant="contained" onClick={() => setModalOpen(true)}>
              Add Site
            </Button>
          </Box>
        </Box>

        <DataGrid
          rows={jobs}
          columns={columns}
          getRowId={r => r.id}
          loading={loading}
          pageSize={50}
          rowsPerPageOptions={[50]}
          autoHeight
          disableSelectionOnClick
          sortingOrder={['desc','asc']}
          initialState={{
            sorting: { sortingModel: [{ field: 'date_posted', sort: 'desc' }] }
          }}
        />

        <AddSiteModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </Box>
    </Box>
  )
}
