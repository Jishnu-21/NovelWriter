import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <aside className={`fixed top-0 left-0 w-64 bg-customGreen text-black min-h-screen p-4 transition-transform ${isOpen ? 'transform-none' : '-translate-x-full'} md:relative md:translate-x-0`}>
            <button
                className="md:hidden absolute top-4 right-4 text-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            <ul className="mt-10">
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
