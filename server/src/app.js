const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const config = require('./config');
const boardRoutes = require('./routes/boards');
const boardService = require('./services/BoardService');
const { handleConnection } = require('./socket/handlers');

const app = express();
const server = http.createServer(app);

// Configure CORS for both Express and Socket.io
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

const io = socketIo(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ["GET", "POST"],
    credentials: true
  },
  ...config.socket
});

app.use(express.json());

// API Routes
app.use('/api/boards', (req, res, next) => {
  // Pass io instance to routes for socket notifications
  req.io = io;
  next();
}, boardRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  handleConnection(io, socket);
});

server.listen(config.port, () => {
  console.log(`RetroBoard server running on port ${config.port}`);
});

module.exports = { app, server, io };
