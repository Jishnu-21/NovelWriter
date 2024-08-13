import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';

const TopNavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin');
  };

  return (
    <div className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-semibold"></div>
      <button
        onClick={handleLogout}
        className="bg-red-600 px-4 py-2 rounded hover:bg-red-500"
      >
        Logout
      </button>
    </div>
  );
};

export default TopNavBar;
