import React, { useEffect, useState, useRef } from 'react';
import { API_URL } from '../../config';
import axios from 'axios';
import { Send, X } from 'lucide-react';

const ChatPopup = ({ socket, user, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const getSenderDetails = () => {
    const sender = JSON.parse(localStorage.getItem('user'));
    if (sender) {
      if (sender.user) {
        return { id: sender.user.id, username: sender.user.username };
      }
      return { id: sender._id, username: sender.username };
    }
    return null;
  };

  const senderDetails = getSenderDetails();

  useEffect(() => {
    if (!user) return;

    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`${API_URL}/chat/${user._id}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };
    fetchChatHistory();

    if (socket) {
      socket.emit('joinRoom', { userId: user._id });

      socket.on('message', (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    return () => {
      if (socket) {
        socket.emit('leaveRoom', { userId: user._id });
        socket.off('message');
      }
    };
  }, [socket, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() && user) {
      const newMessage = {
        userId: user._id,
        text: message,
        sender: senderDetails?.username || 'Unknown',
      };

      socket.emit('sendMessage', newMessage);

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');

      try {
        await axios.post(`${API_URL}/chat/send`, newMessage);
      } catch (error) {
        console.error('Failed to save message:', error);
      }
    }
  };

  return (
    <div className="fixed bottom-14 right-10 w-full md:w-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg overflow-hidden">
      <div className="relative h-40 overflow-hidden">
        <img
          src="/public/Rectangle 2.png"
          alt="Background"
          className="w-full h-full object-fit opacity-70"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
          <h2 className="text-2xl font-bold">{user?.username || 'Unknown User'}'s Live Session</h2>
          <h2>{user?.followers?.length || 0} Members</h2>
          <p className="text-sm opacity-75">A live chat interface that allows for seamless, natural communication and connection.</p>
        </div>
        <button onClick={onClose} className="absolute top-2 right-2 text-white">
          <X size={24} />
        </button>
      </div>
      <div className="bg-white p-4 h-96 overflow-y-auto">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div key={idx} className={`mb-4 ${msg.sender === senderDetails?.username ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg ${msg.sender === senderDetails?.username ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                <p>{msg.text}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">{msg.sender}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet.</p>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-white p-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;