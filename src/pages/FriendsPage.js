import React from 'react';
import { Box, Typography } from '@mui/material';

const FriendsPage = () => {
  return (
    <Box sx={{ p: 6 }}>
      <Typography sx={{
        fontFamily: 'var(--text-headline-large-font-family)',
        fontSize: 'var(--text-headline-large-font-size)',
        fontWeight: 'var(--text-headline-large-font-weight)',
        color: 'var(--color-on-surface)',
      }}>
        Friends
      </Typography>
    </Box>
  );
};

export default FriendsPage;
