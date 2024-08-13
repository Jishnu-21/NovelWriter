// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.isAdmin;

  // Check if the route is protected and the user is not authorized
  if (rest.isAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  // Render the component if the user is authorized or the route is not protected
  return Component;
};

export default ProtectedRoute;
