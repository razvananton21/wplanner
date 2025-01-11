import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { Routes, Route, useLocation } from 'react-router-dom';
import theme from './theme/theme';
import WeddingList from './components/weddings/WeddingList';
import WeddingDetails from './components/weddings/WeddingDetails';
import BottomNav from './components/navigation/BottomNav';
import ResponsiveLayout from './components/layout/ResponsiveLayout';
import Header from './components/layout/Header';

const App = () => {
  const location = useLocation();
  const isWeddingsView = location.pathname === '/' || location.pathname === '/weddings';

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
            <Route path="/weddings/:id/:section" element={<WeddingDetails />} />
            <Route path="/calendar" element={<div>Calendar View (Coming Soon)</div>} />
            <Route path="/guests" element={<div>Guest Management (Coming Soon)</div>} />
            <Route path="/settings" element={<div>Settings (Coming Soon)</div>} />
          </Routes>
        </ResponsiveLayout>
        {!isWeddingsView && <BottomNav />}
      </Box>
    </ThemeProvider>
  );
};

export default App;