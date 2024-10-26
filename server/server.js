const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIO = require('socket.io');
const next = require('next');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');


const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use(cors({
        origin: 'https://chat-app-a9vb.onrender.com',
        credentials: true,
    }));
    
    server.use(express.json());

    // Connect to MongoDB
    mongoose
        .connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('DB Connection Successful');
        })
        .catch((err) => {
            console.log(err.message);
        });

    // API Routes
    server.use('/api/auth', authRoutes);
    server.use('/api/messages', messageRoutes);

    // Test Route
    server.get('/ping', (_req, res) => {
        return res.json({ msg: 'Ping Successful' });
    });

    // Handling Next.js pages
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    const port = process.env.PORT || 3000;
    const httpServer = server.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });

    // Socket.IO setup
    const io = socketIO(httpServer, {
        cors: {
            origin: 'https://chat-app-a9vb.onrender.com',
            credentials: true,
        },
    });

    global.onlineUsers = new Map();
    io.on('connection', (socket) => {
        global.chatSocket = socket;
        socket.on('add-user', (userId) => {
            global.onlineUsers.set(userId, socket.id);
        });

        socket.on('send-msg', (data) => {
            const sendUserSocket = global.onlineUsers.get(data.to);
            if (sendUserSocket) {
                socket.to(sendUserSocket).emit('msg-recieve', data.msg);
            }
        });
    });
});
