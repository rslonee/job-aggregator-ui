// components/Sidebar.jsx
import { Box, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Divider } from '@mui/material'
import { Home, ListAlt, ChevronLeft, ChevronRight } from '@mui/icons-material'
import Link from 'next/link'

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <Box
      component="nav"
      sx={{
        width: collapsed ? 56 : 200,
        transition: 'width .2s',
        bgcolor: 'background.paper',
        borderRight: '1px solid rgba(0,0,0,0.12)',
        height: '100vh',
      }}
    >
      <List disablePadding>
        <ListItemButton onClick={onToggle} sx={{ justifyContent: 'center' }}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </ListItemButton>
        <Divider />
        <Link href="/" passHref>
          <ListItemButton component="a" sx={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 1, justifyContent: 'center' }}>
              <Home />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Home" />}
          </ListItemButton>
        </Link>
        <Link href="/status" passHref>
          <ListItemButton component="a" sx={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 1, justifyContent: 'center' }}>
              <ListAlt />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Status" />}
          </ListItemButton>
        </Link>
      </List>
    </Box>
)
}
