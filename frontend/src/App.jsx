import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import theme from './theme/theme';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import { initializeAuth } from './store/slices/authSlice';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/routing/PrivateRoute';
import WeddingList from './components/weddings/WeddingList';
import CreateWedding from './components/weddings/CreateWedding';
import WeddingDetails from './components/weddings/WeddingDetails';
import GuestList from './components/guests/GuestList';
import TableList from './components/tables/TableList';
import RsvpPage from './components/rsvp/RsvpPage';
import FormBuilder from './components/form-builder/FormBuilder';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const currentPath = window.location.pathname;
      // console.log('App - Checking token:', token);

      // Skip auth check for public routes
      if (currentPath.startsWith('/rsvp/') || currentPath === '/login' || currentPath === '/register') {
        setIsInitializing(false);
        return;
      }

      if (token) {
        // console.log('App - Found token in localStorage, initializing auth');
        try {
          await dispatch(initializeAuth()).unwrap();
          // console.log('App - Auth initialized successfully');
          
          // Only redirect if we're on the login page
          if (currentPath === '/login') {
            navigate('/');
          }
        } catch (error) {
          console.error('App - Auth initialization failed:', error);
          localStorage.removeItem('token');
          navigate('/login');
        }
      } else {
        console.log('App - No token found');
        navigate('/login');
      }
      setIsInitializing(false);
    };

    initAuth();
  }, [dispatch, navigate]);

  if (isInitializing) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor={theme.palette.background.default}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rsvp/:token" element={<RsvpPage />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<WeddingList />} />
            <Route path="/weddings" element={<WeddingList />} />
            <Route path="/weddings/new" element={<CreateWedding />} />
            <Route path="/weddings/:id" element={<WeddingDetails />} />
            <Route path="/weddings/:id/guests" element={<GuestList />} />
            <Route path="/weddings/:id/tables" element={<TableList />} />
            <Route path="/weddings/:id/rsvp-form" element={<FormBuilder />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App; 