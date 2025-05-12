// pages/index.js

import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography, Button, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Sidebar from '../components/Sidebar'
import AddSiteModal from '../components/AddSiteModal'

export default function Home() {
  const supabase = useSupabaseClient()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(true)         // collapsed by default
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('jobs')
        .select('id,title,company,location,url,applied,rejected,date_posted,inserted_at')
        .not('applied','eq',true)
        .not('rejected','eq',true)
        .order('inserted_at', { ascending: false })
      setJobs(data || [])
      setLoading(false)
    }
    load()
  }, [supabase])

  const mark = async (id, isApplied) => {
    await supabase
      .from('jobs')
      .update({ applied: isApplied, rejected: !isApplied })
      .eq('id', id)
    setJobs(j => j.filter(x => x.id !== id))
  }

  const columns = [
    { field: 'title', headerName: 'Title', flex: 2, renderCell: ({ row }) => (<a href={row.url} target="_blank" rel="noopener noreferrer">{row.title}</a>) },
    { field: 'company', headerName: 'Company', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'date_posted', headerName: 'Posted', type: 'date', valueGetter: ({ value }) => new Date(value), flex: 1 },
    { field: 'inserted_at', headerName: 'Fetched', type: 'dateTime', valueGetter: ({ value }) => new Date(value), flex: 1 },
    {
      field: 'actions', headerName: 'Actions', flex: 1,
      renderCell: ({ row }) => (
        <>
          <Button size="small" onClick={() => mark(row.id, true)} sx={{ mr: 1 }}>Applied</Button>
          <Button size="small" color="error" onClick={() => mark(row.id, false)}>Rejected</Button>
        </>
      ),
    },
  ]

  return (
    <>
      <AddSiteModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <Box sx={{ display: 'flex' }}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">New Jobs ({jobs.length})</Typography>
            <IconButton onClick={() => setModalOpen(true)}><AddIcon /></IconButton>
          </Box>

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
    </>
  )
}
