import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, TextField, InputAdornment, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/api';
import UserCard from '../components/UserCard';

const DiscoverPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const users = useQuery(api.friends.searchUsers, 
    debouncedSearch.length >= 2 ? { searchTerm: debouncedSearch } : "skip"
  );
  const sendFriendRequest = useMutation(api.friends.sendFriendRequest);
  const cancelFriendRequest = useMutation(api.friends.cancelFriendRequest);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUserAction = async (user) => {
    try {
      if (user.requestStatus === 'pending') {
        await cancelFriendRequest({ toUserId: user._id });
      } else if (user.requestStatus === 'none') {
        await sendFriendRequest({ toUserId: user._id });
      }
    } catch (error) {
      console.error('Error handling friend request:', error);
    }
  };

  const getActionForUser = (user) => {
    if (user.requestStatus === 'friends') {
      return { label: 'Friends', disabled: true, variant: 'outlined' };
    } else if (user.requestStatus === 'pending') {
      return { label: 'Cancel Request', variant: 'outlined' };
    } else if (user.requestStatus === 'received') {
      return { label: 'Respond in Requests', disabled: true, variant: 'outlined' };
    } else {
      return { label: 'Add Friend', variant: 'contained' };
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      p: 3 
    }}>
      <Typography sx={{
        fontFamily: 'var(--text-headline-large-font-family)',
        fontSize: 'var(--text-headline-large-font-size)',
        fontWeight: 'var(--text-headline-large-font-weight)',
        color: 'var(--color-on-surface)',
        mb: 2,
      }}>
        Discover
      </Typography>

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        sx={{ 
          borderBottom: 1, 
          borderColor: 'var(--color-outline-variant)',
          mb: 2 
        }}
      >
        <Tab 
          label="People" 
          sx={{
            fontFamily: 'var(--text-label-large-font-family)',
            fontSize: 'var(--text-label-large-font-size)',
            textTransform: 'none',
          }}
        />
        <Tab 
          label="Events" 
          sx={{
            fontFamily: 'var(--text-label-large-font-family)',
            fontSize: 'var(--text-label-large-font-size)',
            textTransform: 'none',
          }}
        />
      </Tabs>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 0 && (
          <Box>
            <TextField
              fullWidth
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  color: 'var(--color-on-surface)',
                  backgroundColor: 'var(--color-surface-container)',
                  '& fieldset': {
                    borderColor: 'var(--color-outline-variant)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--color-outline)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--color-primary)',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'var(--color-outline)',
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'var(--color-on-surface-variant)' }} />
                  </InputAdornment>
                ),
              }}
            />

            {searchTerm.length < 2 ? (
              <Typography sx={{ 
                color: 'var(--color-on-surface-variant)',
                textAlign: 'center',
                mt: 4,
              }}>
                Type at least 2 characters to search
              </Typography>
            ) : users === undefined ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : users.length === 0 ? (
              <Typography sx={{ 
                color: 'var(--color-on-surface-variant)',
                textAlign: 'center',
                mt: 4,
              }}>
                No users found
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {users.map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    action={getActionForUser(user)}
                    onAction={handleUserAction}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
        {activeTab === 1 && (
          <Box sx={{ p: 2 }}>
            <Typography sx={{ color: 'var(--color-on-surface-variant)' }}>
              Events coming soon...
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DiscoverPage;
