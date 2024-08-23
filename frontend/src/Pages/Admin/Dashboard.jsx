// components/Admin/AdminDashboard.jsx
import React, { useState } from 'react';
import Sidebar from '../../components/Admin/Sidebar';
import TopNavBar from '../../components/Admin/TopNavBar';
import Genre from '../../components/Admin/Genre';
import Users from '../../components/Admin/Users';
import Stories from '../../components/Admin/Stories';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col">
        <TopNavBar />
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Section Header */}
          <h2 className="text-3xl font-semibold mb-4">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section</h2>
          <div className="">
            {/* Content for different sections */}
            {activeSection === 'dashboard' && (
              <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                <h3 className="text-xl font-bold mb-2">Dashboard Content</h3>
                <p>Your dashboard overview goes here.</p>
              </div>
            )}
            {activeSection === 'genre' && (
              <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                <Genre />
              </div>
            )}
            {activeSection === 'users' && (
              <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                <Users />
              </div>
            )}
            {activeSection === 'stories' && (
              <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                <Stories />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
