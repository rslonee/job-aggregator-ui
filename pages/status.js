// pages/status.js
import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import {
  DataGrid,
  GridToolbar
} from '@mui/x-data-grid'
import { Box, Typography, Button } from '@mui/material'
import Sidebar from '../components/Sidebar'
import AddSiteModal from '../components/AddSiteModal'

export default function StatusPage() {
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
      .or('applied.eq.true,rejected.eq.true')
      .order('date_posted', { ascending: false })
    setJobs(data || [])
    setLoading(false)
  }

  useEffect(() => { loadJobs() }, [supabase])

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
      field: 'title',
      headerName: 'Title',
      flex: 2,
      renderCell: ({ row }) => (
        <a href={row.url} target="_blank" rel="noopener noreferrer">
          {row.title}
        </a>
      ),
    },
    { field: 'company', headerName: 'Company', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    {
      field: 'date_posted',
      headerName: 'Posted',
      type: 'date',
      valueGetter: ({ value }) => new Date(value),
      flex: 1
    },
    { field: 'applied', headerName: 'Applied', type: 'boolean', flex: 0.5 },
    { field: 'rejected', headerName: 'Rejected', type: 'boolean', flex: 0.5 },
  ]

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
      />

      <Box
        sx={{
          flexGrow: 1,
          p: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography variant="h6">Applied & Rejected ({jobs.length})</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button variant="outlined" size="small" onClick={rejectOld}>
              Reject 30+ Days
            </Button>
            <Button variant="contained" size="small" onClick={() => setModalOpen(true)}>
              Add Site
            </Button>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <DataGrid
            rows={jobs}
            columns={columns}
            getRowId={r => r.id}
            loading={loading}
            density="compact"
            autoHeight
            pageSize={50}
            rowsPerPageOptions={[50]}
            disableSelectionOnClick
            sortingOrder={['desc','asc']}
            initialState={{
              sorting: { sortingModel: [{ field: 'date_posted', sort: 'desc' }] },
            }}
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 200 } }
            }}
            sx={{
              '& .MuiDataGrid-row:nth-of-type(odd)': {
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
              },
            }}
          />
        </Box>

        <AddSiteModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </Box>
    </Box>
  )
}
