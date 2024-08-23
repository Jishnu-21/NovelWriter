import axios from 'axios';
import { account } from '../../config/appwrite'; // Import your Appwrite config
import { API_URL } from '../../config';

const API_URL2 = `${API_URL}/auth`;

const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL2}/signup`, userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

const verifyOTP = async ({ email, otp }) => {
  try {
    const response = await axios.post(`${API_URL2}/verify-otp`, { email, otp });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
};

const googleSignIn = async () => {
  try {
    await account.createOAuth2Session('google', 'https://novelwriter-2.onrender.com/auth-callback');
  } catch (error) {
    console.error('Google Sign-In error:', error);
    throw error;
  }
};

const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL2}/forgot-password`, { email });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error('Forgot Password error:', error);
    throw error;
  }
};

const resetPassword = async (data) => {
  try {
    const response = await axios.post(`${API_URL2}/reset-password`, data);
    return response.data;
  } catch (error) {
    console.error('Reset Password error:', error);
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('user');
};

const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL2}/login`, userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const adminLogin = async (adminData) => {
  try {
    const response = await axios.post(`${API_URL2}/admin-login`, adminData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify({ ...response.data, isAdmin: true }));
    }
    return response.data;
  } catch (error) {
    console.error('Admin Login error:', error);
    throw error;
  }
};

const resendOTP = async (email) => {
  try {
    console.log('Sending resend OTP request to:', `${API_URL2}/resend-otp`);
    const response = await axios.post(`${API_URL2}/resend-otp`, { email });
    console.log('Resend OTP response:', response);
    return response.data;
  } catch (error) {
    console.error('Resend OTP error:', error.response || error);
    throw error;
  }
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
