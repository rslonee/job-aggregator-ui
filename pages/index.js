// pages/index.js

import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography, Button } from '@mui/material'
import Sidebar from '../components/Sidebar'

export default function Home() {
  const supabase = useSupabaseClient()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)

  // 1) Fetch jobs where neither applied nor reviewed is true
  useEffect(() => {
    async function fetchJobs() {
      setLoading(true)
      const { data, error } = await supabase
        .from('jobs')
        .select('id,site,applied,reviewed,inserted_at')
        .not('applied', 'eq', true)
        .not('reviewed', 'eq', true)
        .order('inserted_at', { ascending: false })

      if (error) console.error(error)
      else setRows(data)
      setLoading(false)
    }
    fetchJobs()
  }, [supabase])

  const mark = async (id, applied) => {
    // set one flag true, the other false
    await supabase
      .from('jobs')
      .update({ applied, reviewed: !applied })
      .eq('id', id)
    // remove from this list immediately
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  const columns = [
    {
      field: 'site',
      headerName: 'Job URL',
      flex: 3,
      renderCell: ({ value }) => (
        <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
      ),
    },
    {
      field: 'inserted_at',
      headerName: 'Fetched At',
      flex: 1,
      type: 'dateTime',
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
            onClick={() => mark(params.row.id, true)}
            sx={{ mr: 1 }}
          >
            Applied
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => mark(params.row.id, false)}
          >
            Reviewed
          </Button>
        </>
      ),
    },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} onAddSite={() => { /* your add-site logic */ }} />
      <Box sx={{ flexGrow: 1, p: 2, height: '100vh' }}>
        <Typography variant="h5" gutterBottom>
          New Jobs ({rows.length})
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(r) => r.id}
          loading={loading}
          pageSize={50}
          rowsPerPageOptions={[50]}
          disableColumnMenu
          disableSelectionOnClick
        />
      </Box>
    </Box>
  )
}
