import Pusher from 'pusher-js';
import { toast } from 'sonner';

// Initialize Pusher
const pusher = new Pusher('818ffa62d3c676b1072b', {
  cluster: 'ap2',
  encrypted: true,
});

// Subscribe to the user's channel
export const subscribeToUserChannel = (userId) => {
  const channel = pusher.subscribe(`user-${userId}`);
  
  channel.bind('new-notification', (data) => {
    toast(data.message, {
      duration: 5000,
      position: 'top-right',
    });
  });

  return () => {
    channel.unbind_all();
    pusher.unsubscribe(`user-${userId}`);
  };
};