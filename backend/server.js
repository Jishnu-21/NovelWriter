// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const storyRoutes = require('./routes/story');
const chapterRoutes = require('./routes/chapter');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const reportRoutes = require('./routes/Report');

const apolloServer = require('./graphql/apolloServer');
const setupSocket = require('./sockets/socket');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
}));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Set up Apollo Server
const startServer = async () => {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    // Start the HTTP server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

// Call the startServer function
startServer();

// Set up REST routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/story', storyRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/report', reportRoutes);

// Serve static files from the frontend dist folder
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// Serve index.html for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

// Set up socket.io
setupSocket(server);
