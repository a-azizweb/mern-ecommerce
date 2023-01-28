import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ isAuthenticated, loading, isAdmin, user }) => {
  if (isAuthenticated === false && loading === false) {
    if (isAdmin === true && user.role !== 'admin') {
      return <Navigate to={'/login'} />;
    }
    return <Navigate to={'/login'} />;
  } else {
    return <Outlet />;
  }
};

export default ProtectedRoutes;
