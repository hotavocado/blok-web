import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Button } from '@mui/material';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/api';
import UserCard from '../components/UserCard';

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const pendingRequests = useQuery(api.friends.getPendingRequests);
  const friends = useQuery(api.friends.getFriends);
  const acceptRequest = useMutation(api.friends.acceptFriendRequest);
  const ignoreRequest = useMutation(api.friends.ignoreFriendRequest);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAccept = async (request) => {
    try {
      await acceptRequest({ requestId: request.requestId });
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleIgnore = async (request) => {
    try {
      await ignoreRequest({ requestId: request.requestId });
    } catch (error) {
      console.error('Error ignoring request:', error);
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
        Friends
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
          label="My Friends" 
          sx={{
            fontFamily: 'var(--text-label-large-font-family)',
            fontSize: 'var(--text-label-large-font-size)',
            textTransform: 'none',
          }}
        />
        <Tab 
          label={`Requests ${pendingRequests?.length > 0 ? `(${pendingRequests.length})` : ''}`}
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
            {!friends ? (
              <Typography sx={{ color: 'var(--color-on-surface-variant)', textAlign: 'center', mt: 4 }}>
                Loading...
              </Typography>
            ) : friends.length === 0 ? (
              <Typography sx={{ color: 'var(--color-on-surface-variant)', textAlign: 'center', mt: 4 }}>
                No friends yet. Search for people in the Discover page!
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {friends.map((friend) => (
                  <UserCard
                    key={friend._id}
                    user={friend}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
        {activeTab === 1 && (
          <Box>
            {!pendingRequests ? (
              <Typography sx={{ color: 'var(--color-on-surface-variant)', textAlign: 'center', mt: 4 }}>
                Loading...
              </Typography>
            ) : pendingRequests.length === 0 ? (
              <Typography sx={{ color: 'var(--color-on-surface-variant)', textAlign: 'center', mt: 4 }}>
                No pending friend requests
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {pendingRequests.map((request) => (
                  <Box
                    key={request.requestId}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      padding: 2,
                      backgroundColor: 'var(--color-surface-container)',
                      borderRadius: '12px',
                      border: '1px solid var(--color-outline-variant)',
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <UserCard user={request.user} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        onClick={() => handleAccept(request)}
                        sx={{ textTransform: 'none' }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => handleIgnore(request)}
                        sx={{ textTransform: 'none' }}
                      >
                        Ignore
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FriendsPage;
