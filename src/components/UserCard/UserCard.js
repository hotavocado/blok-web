import React from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';

const UserCard = ({ user, action, onAction, loading = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: 2,
        backgroundColor: 'var(--color-surface-container)',
        borderRadius: '12px',
        border: '1px solid var(--color-outline-variant)',
        transition: 'all 0.2s',
        '&:hover': {
          backgroundColor: 'var(--color-surface-container-high)',
        },
      }}
    >
      <Avatar
        src={user?.avatarUrl}
        alt={user?.name}
        sx={{
          width: 56,
          height: 56,
          backgroundColor: 'var(--color-primary-container)',
          color: 'var(--color-on-primary-container)',
        }}
      >
        {user?.name?.charAt(0).toUpperCase()}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: 'var(--text-title-medium-font-family)',
            fontSize: 'var(--text-title-medium-font-size)',
            fontWeight: 'var(--text-title-medium-font-weight)',
            color: 'var(--color-on-surface)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {user?.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'var(--text-body-medium-font-family)',
            fontSize: 'var(--text-body-medium-font-size)',
            color: 'var(--color-on-surface-variant)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {user?.email}
        </Typography>
      </Box>

      {action && (
        <Button
          variant={action.variant || 'contained'}
          onClick={() => onAction(user)}
          disabled={loading || action.disabled}
          sx={{
            minWidth: '120px',
            textTransform: 'none',
          }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};

export default UserCard;
