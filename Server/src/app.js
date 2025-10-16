import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/connectDB.js';
import redisService from './services/redisService.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import categoryRouter from './routes/category.route.js';
import taskRouter from './routes/task.route.js';
import notificationRouter from './routes/notification.route.js';

const app = express();
dotenv.config();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/task',taskRouter);
app.use('/api/notifications', notificationRouter);

await connectDB();

// Initialize Redis connection
try {
    await redisService.connect();
    console.log('Redis connected successfully');
} catch (error) {
    console.error('Failed to connect to Redis:', error);
}

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Socket.IO authentication middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    // You can add JWT verification here if needed
    next();
});

// Store user socket connections
const userSockets = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Store user socket connection
    socket.on('user_connected', (userId) => {
        userSockets.set(userId, socket.id);
        console.log(`User ${userId} connected with socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
        // Remove user socket connection
        for (const [userId, socketId] of userSockets.entries()) {
            if (socketId === socket.id) {
                userSockets.delete(userId);
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    });
});

// Make io available globally for sending notifications
global.io = io;
global.userSockets = userSockets;

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});