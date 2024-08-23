const socketIo = require('socket.io');
const Chat = require('../models/Chat');

const setupSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: 'https://novelwriter-2.onrender.com',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        path: '/seacher',
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('joinRoom', ({ userId }) => {
            socket.join(`room-${userId}`);
            console.log(`User ${userId} joined room room-${userId}`);
        });

        socket.on('sendMessage', (message) => {
            io.to(`room-${message.userId}`).emit('message', message);
            saveMessageToDatabase(message);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    const saveMessageToDatabase = async (message) => {
        try {
            const newMessage = new Chat(message);
            await newMessage.save();
        } catch (error) {
            console.error('Failed to save message:', error);
        }
    };
};

module.exports = setupSocket;
