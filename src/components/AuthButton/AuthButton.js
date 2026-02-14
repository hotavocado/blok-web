import React from 'react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { Box, Button, Typography } from '@mui/material';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const AuthButton = () => {
  const { isSignedIn, user } = useUser();
  const storeUser = useMutation(api.auth.store);
  const currentUser = useQuery(api.auth.current);

  // Store/update user in Convex when signed in
  React.useEffect(() => {
    if (isSignedIn) {
      storeUser();
    }
  }, [isSignedIn, storeUser]);

  if (isSignedIn) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography sx={{
          fontFamily: 'var(--text-body-medium-font-family)',
          fontSize: 'var(--text-body-medium-font-size)',
          color: 'var(--color-on-surface)'
        }}>
          {currentUser?.name || user.fullName}
        </Typography>
        <UserButton afterSignOutUrl="/" />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <SignInButton mode="modal" asChild>
        <Button variant="outlined" sx={{ width: 120 }}>
          Sign In
        </Button>
      </SignInButton>
      <SignUpButton mode="modal" asChild>
        <Button variant="contained" sx={{ width: 120 }}>
          Sign Up
        </Button>
      </SignUpButton>
    </Box>
  );
};

export default AuthButton;
