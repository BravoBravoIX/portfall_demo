import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const HomeRedirect = () => {
  const { user } = useAuth();

  // If authenticated, redirect to the user's role-specific home page
  if (user.isAuthenticated && user.config && user.config.homePage) {
    return <Navigate to={user.config.homePage} replace />;
  }

  // If not authenticated, redirect to login
  return <Navigate to="/login" replace />;
};

export default HomeRedirect;