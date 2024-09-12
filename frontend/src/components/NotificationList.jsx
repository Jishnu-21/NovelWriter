import React, { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationList = () => {
  const { notifications } = useNotifications();

  // Show the latest notification as toast when it changes
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1]; // Get the last notification
      toast(latestNotification); // Show the latest notification
    }
  }, [notifications]);

  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export default NotificationList;
