import axios from 'axios';
import { account } from '../../config/appwrite' // Import your Appwrite config
import {API_URL} from '../../config'

const API_URL2 = '${API_URL}/auth/';

const signup = async (userData) => {
  const response = await axios.post(API_URL + 'signup', userData);
  return response.data;
};

const verifyOTP = async ({ email, otp }) => {
  const response = await axios.post(API_URL2 + 'verify-otp', { email, otp });
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const googleSignIn = async () => {
  try {
    await account.createOAuth2Session('google', 'http://localhost:5173/auth-callback');
  } catch (error) {
    console.error('Google Sign-In error:', error);
    throw error;
  }
};


const forgotPassword = async (email) => {
  const response = await axios.post(API_URL2 + 'forgot-password', { email });
  return response.data;
};

const resetPassword = async (data) => {
  const response = await axios.post(`${API_URL2}reset-password`, data);
  return response.data;
};


const logout = () => {
  localStorage.removeItem('user');
};

const login = async (userData) => {
  const response = await axios.post(API_URL2 + 'login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const adminLogin = async (adminData) => {
  const response = await axios.post(API_URL2 + 'admin-login', adminData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify({ ...response.data, isAdmin: true }));
  }
  return response.data;
};


const resendOTP = async (email) => {
  const response = await axios.post(API_URL2 + 'resend-otp', { email });
  return response.data;
};

const authService = {
  signup,
  verifyOTP,
  login,
  logout,
  resendOTP,
  googleSignIn,
  forgotPassword,
  resetPassword,
  adminLogin
};

export default authService;