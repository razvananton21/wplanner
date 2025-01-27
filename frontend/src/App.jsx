import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme/theme';
import WeddingList from './components/weddings/WeddingList';
import WeddingDetails from './components/weddings/WeddingDetails';
import ResponsiveLayout from './components/layout/ResponsiveLayout';
import Header from './components/layout/Header';
import EditWeddingPage from './components/weddings/EditWeddingPage';
import GuestsPage from './components/guests/GuestsPage';
import EditGuestPage from './components/guests/EditGuestPage';
import TimelinePage from './components/timeline/TimelinePage';
import TasksPage from './components/tasks/TasksPage';
import VendorsPage from './components/vendors/VendorsPage';
import TablesPage from './components/tables/TablesPage';
import RsvpsPage from './components/rsvp/RsvpsPage';
import RsvpPage from './components/rsvp/RsvpPage';
import InvitationPage from './components/invitation/InvitationPage';
import BudgetPage from './components/budget/BudgetPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AuthLayout from './components/layout/AuthLayout';

const App = () => {
  const location = useLocation();
  const isPublicPage = location.pathname.startsWith('/rsvp/');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            position: 'relative',
            ...(isAuthPage && {
              height: '100vh',
              overflow: 'hidden',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            })
          }}
        >
          {!isPublicPage && !isAuthPage && <Header />}
          {isPublicPage ? (
            <Routes>
              <Route path="/rsvp/:token" element={<RsvpPage />} />
            </Routes>
          ) : isAuthPage ? (
            <AuthLayout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </AuthLayout>
          ) : (
            <ResponsiveLayout>
              <Routes>
                <Route path="/" element={<WeddingList />} />
                <Route path="/weddings" element={<WeddingList />} />
                <Route path="/weddings/:id" element={<WeddingDetails />} />
                <Route path="/weddings/:id/edit" element={<EditWeddingPage />} />
                <Route path="/weddings/:id/guests" element={<GuestsPage />} />
                <Route path="/weddings/:id/guests/add" element={<EditGuestPage />} />
                <Route path="/weddings/:id/guests/:guestId/edit" element={<EditGuestPage />} />
                <Route path="/weddings/:id/timeline" element={<TimelinePage />} />
                <Route path="/weddings/:id/tasks" element={<TasksPage />} />
                <Route path="/weddings/:id/vendors" element={<VendorsPage />} />
                <Route path="/weddings/:id/tables" element={<TablesPage />} />
                <Route path="/weddings/:id/rsvps" element={<RsvpsPage />} />
                <Route path="/weddings/:id/rsvp-form" element={<RsvpsPage />} />
                <Route path="/weddings/:id/invitation" element={<InvitationPage />} />
                <Route path="/weddings/:id/budget" element={<BudgetPage />} />
                <Route path="/weddings/:id/:section" element={<WeddingDetails />} />
                <Route path="/calendar" element={<div>Coming soon</div>} />
                <Route path="/guests" element={<div>Guest Management (Coming Soon)</div>} />
                <Route path="/settings" element={<div>Settings (Coming Soon)</div>} />
              </Routes>
            </ResponsiveLayout>
          )}
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;