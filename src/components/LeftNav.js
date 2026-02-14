import React from 'react';
import { Box, Typography, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';

// Import custom icons
import { ReactComponent as BloksLine } from '../assets/icons/bloks-line.svg';
import { ReactComponent as BloksFilled } from '../assets/icons/bloks-filled.svg';
import { ReactComponent as SearchLine } from '../assets/icons/search-line.svg';
import { ReactComponent as SearchFilled } from '../assets/icons/search-filled.svg';
import { ReactComponent as UsersLine } from '../assets/icons/users-line.svg';
import { ReactComponent as UsersFilled } from '../assets/icons/users-filled.svg';

const LeftNav = ({ currentPage, onNavigate }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const navItems = [
    { id: 'me', label: 'Me', icon: <PersonIcon />, iconSelected: <PersonIcon /> },
    { id: 'bloks', label: 'Bloks', icon: <BloksLine />, iconSelected: <BloksFilled /> },
    { id: 'discover', label: 'Discover', icon: <SearchLine />, iconSelected: <SearchFilled /> },
    { id: 'friends', label: 'Friends', icon: <UsersLine />, iconSelected: <UsersFilled /> },
  ];

  return (
    <Box sx={{
      width: '240px',
      backgroundColor: 'var(--color-surface-1)',
      borderRadius: '16px',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {/* Sub box 1: Header */}
      <Box>
        <Typography sx={{
          fontFamily: 'var(--text-title-medium-font-family)',
          fontSize: 'var(--text-title-medium-font-size)',
          fontWeight: 'var(--text-title-medium-font-weight)',
          color: 'var(--color-on-surface)',
        }}>
          {user?.fullName ? `${user.fullName.split(' ')[0]}'s BLOK` : 'BLOK'}
        </Typography>
      </Box>

      {/* Sub box 2: Navigation Items */}
      <Box sx={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.id}
            selected={currentPage === item.id}
            onClick={() => onNavigate(item.id)}
            sx={{
              width: '100%',
              height: '52px',
              borderRadius: '8px',
              padding: '0 12px',
              '&.Mui-selected': {
                backgroundColor: 'var(--color-secondary-container)',
                '&:hover': {
                  backgroundColor: 'var(--color-secondary-container)',
                },
              },
              '&:hover': {
                backgroundColor: 'var(--state-layer-on-surface-008)',
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: currentPage === item.id ? 'var(--color-on-secondary-container)' : 'var(--color-on-surface-variant)',
              minWidth: 40,
            }}>
              {currentPage === item.id ? item.iconSelected : item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                sx: {
                  fontFamily: 'var(--text-label-large-font-family)',
                  fontSize: 'var(--text-label-large-font-size)',
                  fontWeight: currentPage === item.id ? 'var(--text-label-bold-large-font-weight)' : 'var(--text-label-large-font-weight)',
                  color: currentPage === item.id ? 'var(--color-on-secondary-container)' : 'var(--color-on-surface)',
                }
              }}
            />
          </ListItemButton>
        ))}
      </Box>
    </Box>
  );
};

export default LeftNav;
