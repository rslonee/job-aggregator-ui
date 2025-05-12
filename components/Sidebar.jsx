// components/Sidebar.jsx
import { useState } from 'react'
import { Box, List, ListItemButton, ListItemText, Divider } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import AddIcon from '@mui/icons-material/Add'
import MenuIcon from '@mui/icons-material/Menu'

export default function Sidebar({ collapsed, onToggle, onAddSite }) {
  return (
    <Box
      sx={{
        width: collapsed ? '56px' : '200px',
        transition: 'width .3s',
        borderRight: '1px solid #ddd',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <List component="nav" sx={{ flexGrow: 1, p: 0 }}>
        <ListItemButton onClick={onToggle} sx={{ justifyContent: 'center' }}>
          <MenuIcon />
        </ListItemButton>
        <Divider />
        {!collapsed && (
          <>
            <ListItemButton component="a" href="/">
              <HomeIcon sx={{ mr: 1 }} />
              <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton onClick={onAddSite}>
              <AddIcon sx={{ mr: 1 }} />
              <ListItemText primary="Add Site" />
            </ListItemButton>
            <ListItemButton component="a" href="/status">
              <ListItemText primary="Applied / Rejected" />
            </ListItemButton>
          </>
        )}
      </List>
    </Box>
  )
}
