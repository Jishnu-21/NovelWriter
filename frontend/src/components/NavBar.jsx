import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { FaUserCircle, FaBars, FaTimes, FaBell } from 'react-icons/fa';
import { API_URL } from '../../src/config/';
import { useTheme } from '../context/ThemeContext'; // Import the dark mode context

const NavBar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [userDetails, setUserDetails] = useState(null);

  const { darkMode, toggleDarkMode } = useTheme(); // Access dark mode context

  const userData = user?.user || {};
  const userId = userData.id || user?._id;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`${API_URL}/users/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    fetchUserData();

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userId]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const isAdmin = userData.isAdmin;

  return (
    <nav className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-300 text-gray-800'} shadow-md`}>
      <div className='max-w-9xl mx-auto sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <Link to="/" className={`text-2xl font-light ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              NovelWriter
            </Link>
          </div>
          <div className='hidden md:flex md:items-center md:space-x-4'>
            <Link to="/gallery" className={`${darkMode ? 'text-white hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-200'} px-3 py-2 rounded-md text-sm font-medium`}>
              Gallery
            </Link>
            <Link to="/about" className={`${darkMode ? 'text-white hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-200'} px-3 py-2 rounded-md text-sm font-medium`}>
              About
            </Link>
            <Link to="/contact" className={`${darkMode ? 'text-white hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-200'} px-3 py-2 rounded-md text-sm font-medium`}>
              Contact Us
            </Link>
          </div>
          <div className='flex items-center'>
            {user && !isAdmin && (
              <Link to="/notifications" className={`${darkMode ? 'text-white hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-200'} px-3 py-2 rounded-md text-sm font-medium mr-2`}>
                <FaBell className="w-5 h-5" />
              </Link>
            )}
            {user && !isAdmin ? (
              <div className="relative ml-3">
                <button
                  onClick={toggleDropdown}
                  className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out"
                  aria-label="User profile menu"
                >
                  {userDetails?.image_url ? (
                    <img 
                      src={userDetails.image_url} 
                      alt="User profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-8 h-8`} />
                  )}
                </button>
                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'} origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
                  >
                    <p className={`font-sans py-1 px-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      {userDetails.username}
                    </p>
                    <hr className={`border-t-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`} />
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : !user ? (
              <Link to="/login" className='text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 px-4 py-2 rounded-md text-sm font-medium shadow-lg transition-all duration-300 transform hover:scale-105'>
                Login
              </Link>
            ) : null}
            <button onClick={toggleDarkMode} className="ml-4 md:ml-8">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <div className='ml-4 md:hidden'>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`inline-flex items-center justify-center p-2 rounded-md ${darkMode ? 'text-white hover:text-gray-500 hover:bg-gray-800' : 'text-gray-800 hover:text-gray-500 hover:bg-gray-200'} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500`}
                aria-label="Menu"
              >
                {showMenu ? <FaTimes className="block h-6 w-6" /> : <FaBars className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showMenu && (
        <div className='md:hidden'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
            <Link to="/gallery" className={`${darkMode ? 'text-white hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-200'} block px-3 py-2 rounded-md text-base font-medium`}>
              Gallery
            </Link>
            <Link to="/about" className={`${darkMode ? 'text-white hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-200'} block px-3 py-2 rounded-md text-base font-medium`}>
              About
            </Link>
            <Link to="/contact" className={`${darkMode ? 'text-white hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-200'} block px-3 py-2 rounded-md text-base font-medium`}>
              Contact Us
            </Link>
            {user && !isAdmin && (
              <Link to="/notifications" className={`${darkMode ? 'text-white hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-200'} block px-3 py-2 rounded-md text-base font-medium`}>
                Notifications
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
