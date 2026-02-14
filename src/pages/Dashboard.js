import React from 'react';
import { Box } from '@mui/material';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import LeftNav from '../components/LeftNav';
import RiveAvatar from '../components/RiveAvatar';
import MePage from './MePage';
import BloksPage from './BloksPage';
import DiscoverPage from './DiscoverPage';
import FriendsPage from './FriendsPage';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = React.useState('bloks');
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'me':
        return <MePage />;
      case 'bloks':
        return <BloksPage />;
      case 'discover':
        return <DiscoverPage />;
      case 'friends':
        return <FriendsPage />;
      default:
        return <BloksPage />;
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      backgroundColor: 'var(--color-surface)',
    }}>
      {/* Nav parent box */}
      <Box sx={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        <LeftNav currentPage={currentPage} onNavigate={setCurrentPage} />
      </Box>
      
      {/* Main content box */}
      <Box sx={{
        flex: 1,
        overflow: 'auto',
        padding: '16px',
      }}>
        {renderPage()}
      </Box>
      
      {/* Rive Avatar */}
      <RiveAvatar 
        onNavigate={setCurrentPage}
        onSignOut={handleSignOut}
      />
    </Box>
  );
};

export default Dashboard;
