// components/AddSiteModal.jsx

import { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Box
} from '@mui/material'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

const SCRAPER_TYPES = [
  'workday',
  'greenhouse',
  'manual',
  // add your supported types here
]

export default function AddSiteModal({ open, onClose }) {
  const supabase = useSupabaseClient()
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [type, setType] = useState(SCRAPER_TYPES[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    setLoading(true)
    const { error: err } = await supabase
      .from('sites')
      .insert([{ name, url, base_url: baseUrl, scraper_type: type }])
    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      // reset & close
      setName(''); setUrl(''); setBaseUrl(''); setType(SCRAPER_TYPES[0])
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add New Site</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 1, display: 'grid', gap: 2 }}>
          <TextField
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="URL"
            value={url}
            onChange={e => setUrl(e.target.value)}
            fullWidth
          />
          <TextField
            label="Base URL"
            value={baseUrl}
            onChange={e => setBaseUrl(e.target.value)}
            fullWidth
          />
          <TextField
            label="Scraper Type"
            select
            value={type}
            onChange={e => setType(e.target.value)}
            fullWidth
          >
            {SCRAPER_TYPES.map(t => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>
          {error && <Box sx={{ color: 'error.main' }}>{error}</Box>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={loading || !name || !url}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}
