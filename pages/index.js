// pages/index.js

import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography } from '@mui/material'

export default function Home() {
  const supabase = useSupabaseClient()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch jobs once on mount
  useEffect(() => {
    async function loadJobs() {
      setLoading(true)
      const { data, error } = await supabase
        .from('jobs')
        .select('id,title,company,location,date_posted,url')
        .order('date_posted', { ascending: false })
      if (!error) setJobs(data)
      setLoading(false)
    }
    loadJobs()
  }, [supabase])

  // Define columns for the data grid
  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 2,
      renderCell: (params) => (
        <a
          href={params.row.url}
          target="_blank"
          rel="noopener noreferrer"
        >
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
  ]

  return (
    <Box sx={{ height: '100vh', p: 2 }}>
      <Box
        sx={{
          display:      'flex',
          justifyContent: 'space-between',
          alignItems:   'center',
          mb:           2,
        }}
      >
        <Typography variant="h5">
          Jobs ({jobs.length})
        </Typography>
      </Box>

      <DataGrid
        rows={jobs}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        pageSize={100}
        rowsPerPageOptions={[100, { value: jobs.length, label: 'All' }]}
        disableColumnMenu
        disableSelectionOnClick
        hideFooterSelectedRowCount
        sx={{
          '& .MuiDataGrid-row:nth-of-type(odd)': {
            backgroundColor: 'rgba(0,0,0,0.04)',
          },
        }}
      />
    </Box>
  )
}
