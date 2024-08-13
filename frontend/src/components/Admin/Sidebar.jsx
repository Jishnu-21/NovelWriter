import React from 'react';

const Sidebar = ({ setActiveSection }) => {
  return (
    <div className="w-64 bg-gray-800 p-6 hidden md:block">
      <div className="text-2xl font-semibold mb-6">Admin Panel</div>
      <nav className="space-y-2">
        <button
          className="block py-2 px-4 rounded hover:bg-gray-700 w-full text-left"
          onClick={() => setActiveSection('dashboard')}
        >
          Dashboard
        </button>
        <button
          className="block py-2 px-4 rounded hover:bg-gray-700 w-full text-left"
          onClick={() => setActiveSection('genre')}
        >
          Genre
        </button>
        <button
          className="block py-2 px-4 rounded hover:bg-gray-700 w-full text-left"
          onClick={() => setActiveSection('users')}
        >
          Users
        </button>
        <button
          className="block py-2 px-4 rounded hover:bg-gray-700 w-full text-left"
          onClick={() => setActiveSection('stories')}
        >
          Stories
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
