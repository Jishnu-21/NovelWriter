// AuthCallback.jsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { account } from '../config/appwrite';
import { setUser } from '../features/auth/authSlice';
import axios from 'axios';
import {API_URL} from '../../src/config'
const AuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getAccount = async () => {
      try {
        const user = await account.get();
        console.log('Appwrite user:', user);

        // Send user data to backend to save it in MongoDB and generate token
        const response = await axios.post(`${API_URL}/auth/callback`, {
          userId: user.$id,
          username: user.name,
          email: user.email,
        });

        console.log('Server response:', response.data);

        // Save the token and user in Redux
        dispatch(setUser(response.data.user));
        localStorage.setItem('token', response.data.token);

        navigate('/'); 
      } catch (error) {
        console.error('Error getting account:', error);
        navigate('/login'); // Redirect to login page on error
      }
    };

    getAccount();
  }, [dispatch, navigate]);

  return <div>Authenticating...</div>;
};

export default AuthCallback;
