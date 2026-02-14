import React from 'react';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { Box, CircularProgress } from '@mui/material';

const SSOCallback = () => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: 'var(--color-surface)',
    }}>
      <CircularProgress sx={{ color: 'var(--color-primary)' }} />
      <AuthenticateWithRedirectCallback />
    </Box>
  );
};

export default SSOCallback;
