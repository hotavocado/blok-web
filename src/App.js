import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { ConvexReactClient } from 'convex/react';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import theme from './theme';
import './fonts.css';
import './colors.scss';
import './globals.css';
import HomePage from './pages/HomePage';
import SSOCallback from './pages/SSOCallback';
import Dashboard from './pages/Dashboard';

const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL);

const App = () => {
  return (
    <ClerkProvider 
      publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}
      signInFallbackRedirectUrl="/blok-web/dashboard"
      signUpFallbackRedirectUrl="/blok-web/dashboard"
      afterSignOutUrl="/blok-web"
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider theme={theme}>
          <Router basename="/blok-web">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sso-callback" element={<SSOCallback />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

export default App;
