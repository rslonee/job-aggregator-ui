// components/AddSiteModal.jsx
import { useState } from 'react'
import { Modal, Box, TextField, Button, MenuItem, Typography } from '@mui/material'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

const SCRAPER_TYPES = ['workday', 'greenhouse', 'lever', 'custom']

export default function AddSiteModal({ open, onClose }) {
  const supabase = useSupabaseClient()
  const [form, setForm] = useState({ name: '', url: '', base_url: '', scraper_type: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async () => {
    setLoading(true)
    const { error } = await supabase.from('sites').insert([form])
    setLoading(false)
    if (!error) onClose()
    else alert(error.message)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        bgcolor: 'background.paper', p: 4, borderRadius: 1, width: 300 
      }}>
        <Typography variant="h6" mb={2}>Add Site</Typography>
        <TextField fullWidth label="Name" margin="dense" value={form.name} onChange={handleChange('name')} />
        <TextField fullWidth label="URL" margin="dense" value={form.url} onChange={handleChange('url')} />
        <TextField fullWidth label="Base URL" margin="dense" value={form.base_url} onChange={handleChange('base_url')} />
        <TextField
          fullWidth select
          label="Scraper Type" margin="dense"
          value={form.scraper_type}
          onChange={handleChange('scraper_type')}
        >
          {SCRAPER_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <Box mt={2} sx={{ textAlign: 'right' }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading || !form.scraper_type}>
            {loading ? 'Saving…' : 'Save'}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
