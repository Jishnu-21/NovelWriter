import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword, reset } from '../features/auth/authSlice';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, message } = useSelector((state) => state.auth);
  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { token, newPassword };
    console.log('Submitting payload:', payload);
    dispatch(resetPassword(payload));
  };

  useEffect(() => {
    console.log('Current message:', message);
    if (message === 'Password reset successful') {
      console.log('Navigating to /login');
      navigate('/login');
    }
  }, [message, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700 text-sm font-semibold mb-2">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-white ${
              isLoading ? 'bg-gray-400' : 'bg-black hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        {error && (
          <div className="mt-4 text-red-500 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
