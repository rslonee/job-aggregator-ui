// pages/index.js

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  DialogActions
} from '@mui/material'

export default function Home() {
  const [jobs, setJobs] = useState([])
  const [open, setOpen] = useState(false)
  const [siteName, setSiteName] = useState('')
  const [siteUrl, setSiteUrl] = useState('')
  const [scraperType, setScraperType] = useState('workday')
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  async function fetchJobs() {
    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, company, location, date_posted, url')
    if (error) console.error('Error fetching jobs:', error)
    else setJobs(data || [])
  }

  async function handleAddSite() {
    const { error } = await supabase.from('sites').insert({
      name: siteName,
      url: siteUrl,
      scraper_type: scraperType,
      base_url: baseUrl
    })
    if (error) {
      console.error('Error adding site:', error)
    } else {
      setOpen(false)
      setSiteName('')
      setSiteUrl('')
      setScraperType('workday')
      setBaseUrl('')
    }
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
      )
    },
    { field: 'company', headerName: 'Company', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    {
      field: 'date_posted',
      headerName: 'Date Posted',
      flex: 1,
      type: 'date',
      valueGetter: ({ value }) => new Date(value)
    }
  ]

  return (
    <Box sx={{ height: '100vh', p: 2, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h4">Live Job Feed</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">Total: {jobs.length}</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Site
          </Button>
        </Box>
      </Box>

      {/* Job table */}
      <Box sx={{ flexGrow: 1 }}>
        <DataGrid
          rows={jobs}
          columns={columns}
          pageSize={25}
          rowsPerPageOptions={[25, 50, 100]}
          disableSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: 'date_posted', sort: 'desc' }]
            }
          }}
          sortingOrder={['desc', 'asc']}
          filterMode="client"
          components={{ Toolbar: GridToolbar }}
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5'
            }
          }}
        />
      </Box>

      {/* Add Site dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Site</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={siteName}
            onChange={e => setSiteName(e.target.value)}
            fullWidth
          />
          <TextField
            label="API Endpoint URL"
            value={siteUrl}
            onChange={e => setSiteUrl(e.target.value)}
            fullWidth
          />
          <TextField
            select
            label="Scraper Type"
            value={scraperType}
            onChange={e => setScraperType(e.target.value)}
            fullWidth
          >
            <MenuItem value="workday">Workday</MenuItem>
            <MenuItem value="greenhouse">Greenhouse</MenuItem>
            <MenuItem value="html">HTML</MenuItem>
          </TextField>
          <TextField
            label="Base URL"
            helperText="Prefix for partial job URLs (Workday/HTML only)"
            value={baseUrl}
            onChange={e => setBaseUrl(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSite}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
