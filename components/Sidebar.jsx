// components/Sidebar.jsx

import { Box, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Link from 'next/link'

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <Drawer
      variant="permanent"
      open={!collapsed}
      PaperProps={{ sx: { width: collapsed ? 56 : 240, transition: 'width .2s' } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 1 }}>
        <IconButton onClick={onToggle}>
          <MenuIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <Link href="/" passHref>
          <ListItemButton component="a">
            <ListItemIcon><HomeIcon /></ListItemIcon>
            {!collapsed && <ListItemText primary="Home" />}
          </ListItemButton>
        </Link>
        <Link href="/status" passHref>
          <ListItemButton component="a">
            <ListItemIcon><CheckCircleIcon /></ListItemIcon>
            {!collapsed && <ListItemText primary="Status" />}
          </ListItemButton>
        </Link>
      </List>
    </Drawer>
  )
}
