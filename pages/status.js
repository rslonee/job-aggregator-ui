// pages/status.js

import { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography } from '@mui/material'
import Sidebar from '../components/Sidebar'

export default function StatusPage() {
  const supabase = useSupabaseClient()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)

  // 2) Fetch jobs where applied or reviewed is true
  useEffect(() => {
    async function fetchStatus() {
      setLoading(true)
      const { data, error } = await supabase
        .from('jobs')
        .select('id,site,applied,reviewed,inserted_at')
        .or('applied.eq.true,reviewed.eq.true')
        .order('inserted_at', { ascending: false })

      if (error) console.error(error)
      else setRows(data)
      setLoading(false)
    }
    fetchStatus()
  }, [supabase])

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
      field: 'applied',
      headerName: 'Applied',
      flex: 1,
      type: 'boolean',
    },
    {
      field: 'reviewed',
      headerName: 'Reviewed',
      flex: 1,
      type: 'boolean',
    },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} onAddSite={() => {}} />
      <Box sx={{ flexGrow: 1, p: 2, height: '100vh' }}>
        <Typography variant="h5" gutterBottom>
          Applied & Reviewed Jobs ({rows.length})
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
