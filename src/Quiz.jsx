import React from 'react';
import { useAuth } from './contexts/AuthContext';

const Quiz = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div></div>
  );
};

export default Quiz;
