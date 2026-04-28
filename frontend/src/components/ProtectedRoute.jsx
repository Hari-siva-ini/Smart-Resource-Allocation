import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect based on role if unauthorized
    if (userRole === 'admin') return <Navigate to="/admin-dashboard" />;
    if (userRole === 'volunteer') return <Navigate to="/volunteer-dashboard" />;
    if (userRole === 'reporter') return <Navigate to="/reporter-dashboard" />;
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
