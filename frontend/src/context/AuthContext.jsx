// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config'; // Make sure to import your API URL
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userData = user?.user || user;
  const currentUserId = userData?.id || user?._id;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUserId) return;

      try {
        const response = await fetch(`${API_URL}/users/${currentUserId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Check if the user is blocked
        if (data.isBlocked) {
          // Show a toast notification that the user is blocked
          toast.error('Your account has been blocked. Please contact support.')

          // Log out the user and navigate to login
          dispatch(logout());
          navigate('/login'); // Adjust the path as necessary
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [currentUserId, dispatch, navigate]);

  return (
    <AuthContext.Provider value={{ user: userData }}>
      {children}
      <ToastContainer /> {/* Add ToastContainer here */}
    </AuthContext.Provider>
  );
};
