// components/Sidebar.jsx
import { useState } from 'react'
import { Box, List, ListItemButton, ListItemText, Collapse, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

export default function Sidebar({ onAddSite }) {
  const [open, setOpen] = useState(false)

  const handleToggle = () => setOpen(!open)

  return (
    <Box sx={{ width: 250, borderRight: '1px solid #ddd', height: '100vh' }}>
      <List component="nav">
        <ListItemButton onClick={handleToggle}>
          <MenuIcon />
          <ListItemText primary="Menu" sx={{ pl: 1 }} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={onAddSite}>
              <ListItemText primary="Add Site" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component="a" href="/status">
              <ListItemText primary="Applied/Rejected Jobs" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Box>
  )
}
