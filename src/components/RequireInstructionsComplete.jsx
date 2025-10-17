import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RequireInstructionsComplete = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const instructionsComplete = localStorage.getItem('instructionsComplete') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!instructionsComplete) {
    return <Navigate to="/instructions" replace />;
  }

  return children;
};

export default RequireInstructionsComplete;


