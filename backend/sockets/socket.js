// socket.js
const { Server } = require('socket.io');
const Chat = require('../models/Chat');

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // Adjust this to your client URL
      methods: ['GET', 'POST'],
      credentials: false,
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle joining a chat room
    socket.on('joinRoom', async ({ userId }) => {
      socket.join(userId);
      console.log(`User with ID ${userId} joined room ${userId}`);

      // Fetch chat history for the user
      const chatHistory = await Chat.find({ userId }).sort({ createdAt: 1 });
      socket.emit('chatHistory', chatHistory);
    });

    // Handle messages
    socket.on('sendMessage', async (message) => {
      const newMessage = new Chat({
        userId: message.userId,
        text: message.text,
        sender: message.sender,
        image: message.image,
      });

      await newMessage.save();

      // Emit the message to the specific user
      io.to(message.userId).emit('message', newMessage);
      console.log(`Message sent to room ${message.userId}: ${message.text}`);
    });

    

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = setupSocket;