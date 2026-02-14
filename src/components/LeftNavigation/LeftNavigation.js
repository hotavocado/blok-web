import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  IconButton
} from '@mui/material';
import {
  Home as HomeIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';

const LeftNavigation = ({ open = false, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      icon: <HomeIcon />,
      path: '/'
    }
  ];

  const handleNavigation = (item) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  const isItemActive = (item) => {
    return location.pathname === item.path;
  };

  const drawerWidth = open ? 280 : 80;

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={true}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'var(--color-surface)',
          borderRight: '1px solid var(--color-surface-variant)',
          transition: 'width 0.3s ease',
          overflowX: 'hidden'
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-end' : 'center',
          px: open ? 2 : 0,
          borderBottom: '1px solid var(--color-surface-variant)'
        }}>
          <IconButton onClick={onToggle}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>

        <List sx={{ flex: 1, pt: 2 }}>
          {navigationItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item)}
                sx={{
                  minHeight: 56,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  backgroundColor: isItemActive(item) ? 'var(--color-secondary-container)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isItemActive(item)
                      ? 'var(--color-secondary-container)'
                      : 'var(--state-layer-on-surface-008)',
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: isItemActive(item) ? 'var(--color-on-secondary-container)' : 'var(--color-on-surface-variant)'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    opacity: open ? 1 : 0,
                    '& .MuiListItemText-primary': {
                      fontFamily: 'var(--text-label-large-font-family)',
                      fontSize: 'var(--text-label-large-font-size)',
                      fontWeight: 'var(--text-label-large-font-weight)',
                      color: isItemActive(item) ? 'var(--color-on-secondary-container)' : 'var(--color-on-surface-variant)'
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default LeftNavigation;
