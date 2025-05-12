// pages/index.js

import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material'
import Sidebar from '../components/Sidebar'

export default function Home() {
  const supabase = useSupabaseClient()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [newSite, setNewSite] = useState('')

  // Fetch only jobs that have not yet been acted on
  useEffect(() => {
    async function loadJobs() {
      setLoading(true)
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('applied', false)
        .eq('reviewed', false)
        .order('date_posted', { ascending: false })
      if (!error) setJobs(data)
      setLoading(false)
    }
    loadJobs()
  }, [supabase])

  // Mark a job as applied or reviewed
  const handleStatusUpdate = async (id, isApplied) => {
    await supabase
      .from('jobs')
      .update({
        applied: isApplied,
        reviewed: !isApplied,
      })
      .eq('id', id)

    // remove from list immediately
    setJobs((prev) => prev.filter((j) => j.id !== id))
  }

  const handleToggle = () => setCollapsed((c) => !c)
  const handleAddSite = () => setAddOpen(true)
  const handleAddSave = async () => {
    if (newSite) {
      await supabase.from('sites').insert({ url: newSite })
      setNewSite('')
      setAddOpen(false)
    }
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
      field: 'date_posted',
      headerName: 'Date Posted',
      flex: 1,
      type: 'date',
      valueGetter: ({ value }) => new Date(value),
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
            onClick={() => handleStatusUpdate(params.row.id, true)}
            sx={{ mr: 1 }}
          >
            Applied
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleStatusUpdate(params.row.id, false)}
          >
            Rejected
          </Button>
        </>
      ),
    },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar collapsed={collapsed} onToggle={handleToggle} onAddSite={handleAddSite} />
      <Box sx={{ flexGrow: 1, p: 2, height: '100vh' }}>
        <Typography variant="h5" gutterBottom>
          Jobs ({jobs.length})
        </Typography>
        <DataGrid
          rows={jobs}
          columns={columns}
          getRowId={(r) => r.id}
          loading={loading}
          pageSize={100}
          rowsPerPageOptions={[100]}
          disableColumnMenu
          disableSelectionOnClick
        />
      </Box>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Site</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Site URL"
            type="url"
            fullWidth
            value={newSite}
            onChange={(e) => setNewSite(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
