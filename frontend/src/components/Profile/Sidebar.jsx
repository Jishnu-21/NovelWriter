import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Import and use navigate hook

    const handleLogout = () => {
        dispatch(logout());
        navigate('/'); // Navigate to the home page after logout
    };

    return (
        <aside className="w-1/6 bg-customGreen text-black min-h-screen p-4">
            <ul>
                <li>
                    <Link to="/profile" className="flex items-center py-2 hover:bg-gray-200 rounded">
                        <i className="fas fa-user mr-2"></i> Profile
                    </Link>
                </li>
                <li>
                    <button
                        onClick={handleLogout}
                        className="flex items-center py-2 hover:bg-gray-200 rounded"
                    >
                        <i className="fas fa-sign-out-alt mr-2"></i> Logout
                    </button>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
