import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { logout } from '../features/auth/authSlice';

const ProtectedUserRoute = ({ element }) => {
  const { user } = useSelector((state) => state.auth);
  const [userDetails, setUserDetails] = useState(null);

  const userData = user?.user || {};
  const userId = userData.id || user?._id;
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return; 

      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        console.log(response)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  },[userId])

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (userDetails?.isBlocked||user.isBlocked)  {
    dispatch(logout());
    navigate('/login');
    }
  return element;
};


export default ProtectedUserRoute;