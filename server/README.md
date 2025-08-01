# RetroBoard Server

A collaborative whiteboard server built with Node.js, Express, and Socket.io.

## Project Structure

```
server/
├── index.js                 # Entry point
├── src/
│   ├── app.js              # Main application setup
│   ├── config/             # Configuration files
│   │   └── index.js        # Environment and app configuration
│   ├── models/             # Data models
│   │   ├── Board.js        # Board model with business logic
│   │   └── User.js         # User model
│   ├── routes/             # Express routes
│   │   └── boards.js       # Board API endpoints
│   ├── services/           # Business logic services
│   │   ├── BoardService.js # Board management service
│   │   └── UserService.js  # User management service
│   └── socket/             # Socket.io handlers
│       └── handlers.js     # Real-time event handlers
├── package.json
└── README.md
```

## Architecture

### Models
- **Board**: Represents a whiteboard with objects, metadata, and business logic
- **User**: Represents a connected user with profile information and session data

### Services
- **BoardService**: Manages board storage, retrieval, and operations (singleton)
- **UserService**: Manages user sessions and operations (singleton)

### Routes
- **boards.js**: REST API endpoints for board CRUD operations

### Socket Handlers
- **handlers.js**: Real-time collaboration event handlers for drawing, cursors, and user presence

### Configuration
- **config/index.js**: Centralized configuration management with environment variables

## Features

- Real-time collaborative drawing
- User presence indicators
- Board management (create, read, update, delete)
- Shape and text tools
- Image and video embedding
- Cursor tracking
- User profile management
- Large file upload support (10MB)

## API Endpoints

- `GET /api/boards` - List all boards
- `GET /api/boards/:id` - Get specific board
- `POST /api/boards` - Create new board
- `DELETE /api/boards/:id` - Delete board

## Socket Events

### Client to Server
- `join-board` - Join a board room
- `object-add` - Add object to board
- `object-update` - Update existing object
- `object-delete` - Delete object
- `clear-board` - Clear all objects
- `cursor-move` - Update cursor position
- `text-editing-start/end` - Text editing state
- `user-update` - Update user profile

### Server to Client
- `board-state` - Current board data
- `user-joined/left` - User presence updates
- `object-added/updated/deleted` - Object changes
- `board-cleared` - Board cleared
- `cursor-moved` - Other user cursor positions
- `text-editing-started/ended` - Text editing state
- `user-updated` - User profile changes
- `board-deleted` - Board deletion notification

## Environment Variables

- `SERVER_PORT` - Server port (default: 3000)
- `CORS_ORIGIN` - CORS origin (default: http://localhost:5173)

## Development

```bash
npm start    # Start server
npm run dev  # Start with nodemon (if configured)
```
