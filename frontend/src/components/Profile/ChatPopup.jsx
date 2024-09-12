import React, { useEffect, useState, useRef, useCallback } from 'react';
import { API_URL } from '../../config';
import axios from 'axios';
import { Send, X } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import Pusher from 'pusher-js';

const pusher = new Pusher('818ffa62d3c676b1072b', {
  cluster: 'ap2',
  encrypted: true,
});

const ChatPopup = ({ user, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [image, setImage] = useState(null);
  const messagesEndRef = useRef(null);
  const processedMessageIds = useRef(new Set());

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

  const addMessageToState = useCallback((newMessage) => {
    if (!processedMessageIds.current.has(newMessage._id)) {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      processedMessageIds.current.add(newMessage._id);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`${API_URL}/chat/${user._id}`);
        response.data.forEach(msg => processedMessageIds.current.add(msg._id));
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };
    fetchChatHistory();

    const channel = pusher.subscribe(`user-${user._id}`);

    channel.bind('new-message', (newMessage) => {
      addMessageToState(newMessage);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`user-${user._id}`);
    };
  }, [user, addMessageToState]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (user) {
      const trimmedMessage = message.trim();
  
      if (trimmedMessage === '' && !image) {
        console.warn('Cannot send empty message or image.');
        return;
      }
  
      const formData = new FormData();
      formData.append('userId', user._id);
      formData.append('sender', senderDetails?.username || 'Unknown');
      formData.append('text', trimmedMessage);
  
      if (image) {
        formData.append('image', image);
      }
  
      try {
        const response = await axios.post(`${API_URL}/chat/send`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        const newMessage = response.data;
        // Directly add the new message to the state instead of going through Pusher
        if (!processedMessageIds.current.has(newMessage._id)) {
          addMessageToState(newMessage);
        }
        setMessage('');
        setImage(null);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  
  
  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  return (
    <div className="fixed bottom-14 right-10 w-full md:w-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg overflow-hidden">
      <div className="relative h-40 overflow-hidden">
        <img
          src="/Rectangle 2.png"
          alt="Background"
          className="w-full h-full object-cover opacity-70"
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
                {msg.text && <p>{msg.text}</p>}
                {msg.image && <img src={msg.image} alt="Sent" className="max-w-xs mt-2" />}
              </div>
              <p className="text-xs text-gray-500 mt-1">{msg.sender}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet.</p>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-white p-4 border-t flex items-center space-x-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition">
          📷
        </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="bg-gray-300 text-black p-2 rounded-full hover:bg-gray-400 transition"
        >
          😀
        </button>
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
        >
          <Send size={20} />
        </button>
      </div>
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
    </div>
  );
};

export default ChatPopup;
