import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { FaUserCircle } from 'react-icons/fa';

const NavBar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [userDetails, setUserDetails] = useState(null);

  const userData = user?.user || {};
  const userId = userData.id || user?._id;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return; // Exit if userId is not available

      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
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
    <div className='bg-customGreen w-full flex flex-col md:flex-row justify-between items-center py-2 px-4'>
      <div className='flex justify-between w-full md:w-auto'>
        <Link to="/">
          <h1 className='text-lg'>NovelWriter</h1>
        </Link>
        <button className='md:hidden' onClick={() => setShowMenu(!showMenu)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      <div className={`flex-col md:flex-row flex md:flex items-center space-y-4 md:space-y-0 md:space-x-4 ${showMenu ? 'block' : 'hidden'} md:block`}>
        <Link to="/gallery">
          <p>Gallery</p>
        </Link> 
        <p>About</p>
        <p>Contact Us</p>
      </div>
      {user ? (
        !isAdmin ? (
          <div className="relative flex items-center mt-4 md:mt-0">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2"
            >
              {userDetails?.image_url ? (
                <img 
                  src={userDetails.image_url} 
                  alt="User profile" 
                  className="w-8 h-8 rounded-full object-cover mr-2"
                />
              ) : (
                <FaUserCircle className="w-8 h-8 text-gray-500" />
              )}
            </button>
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10"
              >
                <div className="px-4 py-2 border-b border-gray-200 flex items-center">
                  {userDetails?.image_url ? (
                    <img 
                      src={userDetails.image_url} 
                      alt="User profile" 
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                  ) : (
                    <FaUserCircle className="w-8 h-8 text-gray-500 mr-2" />
                  )}
                  <p className="text-sm font-medium">
                    {userDetails ? userDetails.username : (userData.username || user.username)}
                  </p>
                </div>
                <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : null
      ) : (
        <Link to="/login" className='mt-4 md:mt-0'>
          <button className='border border-black rounded px-4 py-2'>Login</button>
        </Link>
      )}
    </div>
  );
};

export default NavBar;
