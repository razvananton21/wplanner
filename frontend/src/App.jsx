import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { Routes, Route, useLocation } from 'react-router-dom';
import theme from './theme/theme';
import WeddingList from './components/weddings/WeddingList';
import WeddingDetails from './components/weddings/WeddingDetails';
import ResponsiveLayout from './components/layout/ResponsiveLayout';
import Header from './components/layout/Header';
import EditWeddingPage from './components/weddings/EditWeddingPage';
import GuestsPage from './components/guests/GuestsPage';
import EditGuestPage from './components/guests/EditGuestPage';
import TimelinePage from './components/timeline/TimelinePage';

const App = () => {
  const location = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          position: 'relative',
        }}
      >
        <Header />
        <ResponsiveLayout>
          <Routes>
            <Route path="/" element={<WeddingList />} />
            <Route path="/weddings" element={<WeddingList />} />
            <Route path="/weddings/:id" element={<WeddingDetails />} />
            <Route path="/weddings/:id/edit" element={<EditWeddingPage />} />
            <Route path="/weddings/:id/guests" element={<GuestsPage />} />
            <Route path="/weddings/:id/guests/:guestId/edit" element={<EditGuestPage />} />
            <Route path="/weddings/:id/timeline" element={<TimelinePage />} />
            <Route path="/weddings/:id/:section" element={<WeddingDetails />} />
            <Route path="/calendar" element={<div>Calendar View (Coming Soon)</div>} />
            <Route path="/guests" element={<div>Guest Management (Coming Soon)</div>} />
            <Route path="/settings" element={<div>Settings (Coming Soon)</div>} />
          </Routes>
        </ResponsiveLayout>
      </Box>
    </ThemeProvider>
  );
};

export default App;