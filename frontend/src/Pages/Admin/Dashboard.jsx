// components/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Admin/Sidebar';
import TopNavBar from '../../components/Admin/TopNavBar';
import Genre from '../../components/Admin/Genre';
import Users from '../../components/Admin/Users';
import Stories from '../../components/Admin/Stories';
import { API_URL } from '../../config';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [userCount, setUserCount] = useState(0);
    const [storyCount, setStoryCount] = useState(0);
  
    // Fetch counts from your API
    useEffect(() => {
      const fetchCounts = async () => {
        try {
          const usersResponse = await fetch(`${API_URL}/admin/users/count`);
          const usersData = await usersResponse.json();
          setUserCount(usersData.count);
  
          const storiesResponse = await fetch(`${API_URL}/admin/stories/count`);
          const storiesData = await storiesResponse.json();
          setStoryCount(storiesData.count);
        } catch (error) {
          console.error('Error fetching counts:', error);
        }
      };
  
      fetchCounts();
    }, []);
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4 text-center shadow-lg">
                    <h4 className="text-lg font-semibold">Number of Users</h4>
                    <p className="text-2xl font-bold">{userCount}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center shadow-lg">
                    <h4 className="text-lg font-semibold">Number of Stories</h4>
                    <p className="text-2xl font-bold">{storyCount}</p>
                  </div>
                </div>
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
