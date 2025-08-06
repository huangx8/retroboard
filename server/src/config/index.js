const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const config = {
  port: process.env.SERVER_PORT || process.env.PORT || 3000,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  socket: {
    maxHttpBufferSize: 10 * 1024 * 1024, // 10MB limit for large images
    pingTimeout: 60000, // 60 seconds
    pingInterval: 25000 // 25 seconds
  }
};

module.exports = config;
