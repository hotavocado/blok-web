import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useSignIn, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const { signIn } = useSignIn();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement email sign in
    console.log('Email submitted:', email);
  };

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: 'var(--color-surface)',
    }}>
      <Box sx={{
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
        px: 3
      }}>
        <Typography sx={{
          fontFamily: 'var(--text-display-large-font-family)',
          fontSize: '72px',
          fontWeight: 700,
          color: 'var(--color-on-surface)',
          mb: 6,
          letterSpacing: '0.05em'
        }}>
          BLOK
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            sx={{
              py: 1.5,
              borderColor: 'var(--color-outline)',
              color: 'var(--color-on-surface)',
              textTransform: 'none',
              fontSize: '16px',
              fontFamily: 'var(--text-body-large-font-family)',
              '&:hover': {
                borderColor: 'var(--color-primary)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            Sign in with Google
          </Button>

          <Box component="form" onSubmit={handleEmailSubmit}>
            <TextField
              fullWidth
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'var(--color-on-surface)',
                  backgroundColor: 'var(--color-surface)',
                  '& fieldset': {
                    borderColor: 'var(--color-outline)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--color-primary)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--color-primary)',
                  }
                },
                '& .MuiOutlinedInput-input': {
                  py: 1.5,
                  fontFamily: 'var(--text-body-large-font-family)',
                  fontSize: '16px',
                  '&::placeholder': {
                    color: 'var(--color-on-surface-variant)',
                    opacity: 1,
                  }
                }
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
