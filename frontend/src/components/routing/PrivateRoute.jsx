import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  console.log('PrivateRoute - Auth state:', {
    isAuthenticated,
    isLoading,
    hasToken: !!token
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated and not loading, redirect to login
  if (!isAuthenticated && !isLoading) {
    console.log('PrivateRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected route
  console.log('PrivateRoute - Authenticated, rendering protected route');
  return <Outlet />;
};

export default PrivateRoute; 