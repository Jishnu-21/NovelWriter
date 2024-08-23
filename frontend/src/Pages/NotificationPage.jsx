import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../config';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const storedToken = localStorage.getItem('token');
  const token = user?.token || storedToken;

  const userData = user?.user || {};
  const userId = userData.id || user?._id;

  console.log(token)
  console.log(userId)

  useEffect(() => {
    console.log('User object:', user); // Log the user object

    const fetchNotifications = async () => {
      try {
        // Verify the token and user ID before making the request
        if (!token || !userId) {
          console.error('No token or user ID available');
          setLoading(false);
          return;
        }

        console.log('Fetching notifications for user ID:', userId); // Log the user ID

        const response = await axios.get(`${API_URL}/users/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId: userId }, 
        });

        console.log('Fetched notifications:', response.data); // Log the fetched notifications
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    // Check if user ID is present
    if (userId) {
      fetchNotifications();
    } else {
      console.warn('No user ID, cannot fetch notifications'); // Log a warning
      setLoading(false); // If no user ID, set loading to false
    }
  }, [token, user]); // Add user as a dependency

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto py-8">
        <h2 className="text-3xl font-bold text-center mb-6">Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-center text-gray-600">No notifications</p>
        ) : (
          <div className="flex flex-col gap-4"> {/* Change to flex-col for vertical layout */}
            {notifications.map((notification) => (
              <div key={notification._id} className="bg-white shadow-md rounded-lg p-4">
                <p className="text-lg font-semibold">{notification.message}</p>
                <span className="text-gray-500 text-sm">{new Date(notification.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NotificationPage;
