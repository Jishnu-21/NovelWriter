import React, { createContext, useContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { useSelector } from 'react-redux';

// Create a Notification Context
const NotificationContext = createContext();

// Create a provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useSelector((state) => state.auth);
  
  const userData = user?.user || user;
  const currentUserId = userData?.id || user?._id;

  useEffect(() => {
    let pusher;
    let channel;

    if (currentUserId) {
      // Initialize Pusher
      pusher = new Pusher('818ffa62d3c676b1072b', {
        cluster: 'ap2',
      });

      // Subscribe to the user's notification channel
      channel = pusher.subscribe(`user-${currentUserId}`);

      // Listen for notifications
      channel.bind('notification', (data) => {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          data.message,
        ]);
      });
    }

    // Cleanup on unmount or when currentUserId changes
    return () => {
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }
      if (pusher) {
        pusher.disconnect();
      }
      // Clear notifications on logout
      if (!currentUserId) {
        setNotifications([]);
      }
    };
  }, [currentUserId]); // Re-run the effect if currentUserId changes

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  return useContext(NotificationContext);
};
