import React from 'react';
import { Box, Typography, TextField, Avatar, IconButton, Button } from '@mui/material';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/api';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const MePage = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const storeUser = useMutation(api.auth.store);
  const currentUser = useQuery(api.auth.current);
  
  const [name, setName] = React.useState('');
  const [avatarUrl, setAvatarUrl] = React.useState('');

  // Store user in Convex when component mounts
  React.useEffect(() => {
    if (user) {
      storeUser();
    }
  }, [user, storeUser]);

  // Initialize form with user data
  React.useEffect(() => {
    if (user) {
      setName(user.fullName || '');
      setAvatarUrl(user.imageUrl || '');
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // TODO: Implement actual file upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{
      p: 6,
      maxWidth: 800,
    }}>
      <Typography sx={{
        fontFamily: 'var(--text-headline-large-font-family)',
        fontSize: 'var(--text-headline-large-font-size)',
        fontWeight: 'var(--text-headline-large-font-weight)',
        color: 'var(--color-on-surface)',
        mb: 4,
      }}>
        Profile Settings
      </Typography>

      <Box sx={{
        backgroundColor: 'var(--color-surface-1)',
        borderRadius: '16px',
        p: 4,
        mb: 3,
      }}>
        {/* Avatar Section */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={avatarUrl}
              sx={{
                width: 100,
                height: 100,
                fontSize: '40px',
                backgroundColor: 'var(--color-primary)',
              }}
            >
              {!avatarUrl && name.charAt(0)}
            </Avatar>
            <IconButton
              component="label"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
                '&:hover': {
                  backgroundColor: 'var(--color-primary)',
                },
                width: 36,
                height: 36,
              }}
            >
              <PhotoCamera sx={{ fontSize: 20 }} />
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleAvatarUpload}
              />
            </IconButton>
          </Box>

          <Box>
            <Typography sx={{
              fontFamily: 'var(--text-body-large-font-family)',
              fontSize: 'var(--text-body-large-font-size)',
              color: 'var(--color-on-surface-variant)',
              mb: 0.5,
            }}>
              Profile Picture
            </Typography>
            <Typography sx={{
              fontFamily: 'var(--text-body-small-font-family)',
              fontSize: 'var(--text-body-small-font-size)',
              color: 'var(--color-on-surface-variant)',
            }}>
              Click the camera icon to upload a new photo
            </Typography>
          </Box>
        </Box>

        {/* Name Field */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{
            fontFamily: 'var(--text-label-large-font-family)',
            fontSize: 'var(--text-label-large-font-size)',
            color: 'var(--color-on-surface)',
            mb: 1,
          }}>
            Display Name
          </Typography>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
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
                },
              },
              '& .MuiOutlinedInput-input': {
                py: 1.5,
                fontFamily: 'var(--text-body-large-font-family)',
                fontSize: 'var(--text-body-large-font-size)',
              }
            }}
          />
        </Box>

        {/* Email (Read-only) */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{
            fontFamily: 'var(--text-label-large-font-family)',
            fontSize: 'var(--text-label-large-font-size)',
            color: 'var(--color-on-surface)',
            mb: 1,
          }}>
            Email
          </Typography>
          <TextField
            fullWidth
            value={user?.primaryEmailAddress?.emailAddress || ''}
            disabled
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'var(--color-on-surface-variant)',
                backgroundColor: 'var(--color-surface-2)',
                '& fieldset': {
                  borderColor: 'var(--color-outline-variant)',
                },
              },
              '& .MuiOutlinedInput-input': {
                py: 1.5,
                fontFamily: 'var(--text-body-large-font-family)',
                fontSize: 'var(--text-body-large-font-size)',
              }
            }}
          />
        </Box>
      </Box>

      {/* Sign Out Button */}
      <Button
        variant="outlined"
        onClick={handleSignOut}
        sx={{
          py: 1.5,
          px: 4,
          borderColor: 'var(--color-error)',
          color: 'var(--color-error)',
          textTransform: 'none',
          fontSize: '16px',
          fontFamily: 'var(--text-body-large-font-family)',
          '&:hover': {
            borderColor: 'var(--color-error)',
            backgroundColor: 'rgba(255, 0, 0, 0.05)'
          }
        }}
      >
        Sign Out
      </Button>
    </Box>
  );
};

export default MePage;
