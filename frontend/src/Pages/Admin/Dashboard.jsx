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
        <div className="p-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSection === 'dashboard' && (
              <div>Dashboard Content</div>
            )}
            {activeSection === 'genre' && <Genre />}
            {activeSection === 'users' && <Users />}
            {activeSection === 'stories' && <Stories />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
