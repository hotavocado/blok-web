import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import Calendar from '../components/Calendar';

const BloksPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
        Bloks
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
          label="Calendar" 
          sx={{
            fontFamily: 'var(--text-label-large-font-family)',
            fontSize: 'var(--text-label-large-font-size)',
            textTransform: 'none',
          }}
        />
        <Tab 
          label="Templates" 
          sx={{
            fontFamily: 'var(--text-label-large-font-family)',
            fontSize: 'var(--text-label-large-font-size)',
            textTransform: 'none',
          }}
        />
      </Tabs>

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 0 && <Calendar />}
        {activeTab === 1 && (
          <Box sx={{ p: 2 }}>
            <Typography sx={{ color: 'var(--color-on-surface-variant)' }}>
              Templates coming soon...
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BloksPage;
