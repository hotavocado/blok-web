import React from 'react';
import { Box, Typography, ListItemButton, ListItemIcon, ListItemText, Avatar } from '@mui/material';
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
import { ReactComponent as DoubleArrowLine } from '../assets/icons/doublearrow-line.svg';

const LeftNav = ({ currentPage, onNavigate }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = React.useState(false);
  const collapseTimeout = React.useRef(null);

  const handleMouseEnter = () => {
    // Clear any pending collapse timeout
    if (collapseTimeout.current) {
      clearTimeout(collapseTimeout.current);
      collapseTimeout.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    // Set a 0.8-second delay before collapsing
    collapseTimeout.current = setTimeout(() => {
      setIsHovered(false);
    }, 800);
  };

  const navItems = [
    { 
      id: 'me', 
      label: 'Me', 
      icon: (
        <Avatar
          src={user?.imageUrl}
          alt={user?.fullName}
          sx={{
            width: '36px',
            height: '36px',
            borderRadius: '99px',
          }}
        >
          {user?.fullName?.charAt(0) || 'M'}
        </Avatar>
      ), 
      iconSelected: (
        <Avatar
          src={user?.imageUrl}
          alt={user?.fullName}
          sx={{
            width: '36px',
            height: '36px',
            borderRadius: '99px',
          }}
        >
          {user?.fullName?.charAt(0) || 'M'}
        </Avatar>
      )
    },
    { id: 'bloks', label: 'Bloks', icon: <BloksLine />, iconSelected: <BloksFilled /> },
    { id: 'discover', label: 'Discover', icon: <SearchLine />, iconSelected: <SearchFilled /> },
    { id: 'friends', label: 'Friends', icon: <UsersLine />, iconSelected: <UsersFilled /> },
  ];

  return (
    <Box 
      sx={{
        width: '240px',
        backgroundColor: 'var(--color-surface-1)',
        borderRadius: '16px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Profile Header as Menu Item */}
      <ListItemButton
        sx={{
          width: '100%',
          height: '52px',
          borderRadius: '8px',
          padding: '6px',
          cursor: 'default',
          gap: '12px',
          '&:hover': {
            backgroundColor: 'var(--state-layer-on-surface-008)',
          },
        }}
      >
        <ListItemIcon sx={{ 
          minWidth: 40,
          mr: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Avatar
            src={user?.imageUrl}
            alt={user?.fullName}
            sx={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
            }}
          >
            {user?.fullName?.charAt(0) || 'B'}
          </Avatar>
        </ListItemIcon>
        <ListItemText 
          primary={user?.fullName ? `${user.fullName.split(' ')[0]}'s BLOK` : 'BLOK'}
          primaryTypographyProps={{
            sx: {
              fontFamily: 'var(--text-label-large-font-family)',
              fontSize: 'var(--text-label-large-font-size)',
              fontWeight: 'var(--text-label-bold-large-font-weight)',
              color: 'var(--color-on-surface)',
            }
          }}
        />
        <Box sx={{
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-on-surface-variant)',
        }}>
          <DoubleArrowLine />
        </Box>
      </ListItemButton>

      {/* Sub box 2: Navigation Items */}
      <Box sx={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}>
        {navItems.map((item) => {
          const isSelected = currentPage === item.id;
          const shouldShow = isHovered || isSelected;
          
          return (
            <ListItemButton
              key={item.id}
              selected={isSelected}
              onClick={() => onNavigate(item.id)}
              sx={{
                width: '100%',
                height: shouldShow ? '52px' : '0px',
                borderRadius: '8px',
                padding: shouldShow ? '6px' : '0px',
                opacity: shouldShow ? 1 : 0,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
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
                color: isSelected ? 'var(--color-on-secondary-container)' : 'var(--color-on-surface-variant)',
                minWidth: 40,
                width: 40,
                height: 40,
                mr: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {isSelected ? item.iconSelected : item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  sx: {
                    fontFamily: 'var(--text-label-large-font-family)',
                    fontSize: 'var(--text-label-large-font-size)',
                    fontWeight: isSelected ? 'var(--text-label-bold-large-font-weight)' : 'var(--text-label-large-font-weight)',
                    color: isSelected ? 'var(--color-on-secondary-container)' : 'var(--color-on-surface)',
                  }
                }}
              />
            </ListItemButton>
          );
        })}
      </Box>
    </Box>
  );
};

export default LeftNav;
