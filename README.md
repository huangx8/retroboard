# 🎯 RetroBoard - Collaborative Whiteboard for Retrospectives

A real-time collaborative whiteboard application designed specifically for agile retrospectives and team brainstorming
sessions. Built with React, TypeScript, Socket.io, and Konva.js.

## 📁 Project Structure

```
retroboard/
├── README.md              # Project documentation
├── frontend/              # React + TypeScript frontend
│   ├── src/              # Source code
│   │   ├── components/   # React components
│   │   │   ├── BoardList.tsx       # Board selection interface
│   │   │   ├── DrawableShape.tsx   # Canvas shape rendering
│   │   │   ├── OnlineUsersList.tsx # Online users display
│   │   │   ├── TemplateSelector.tsx # Board template selection
│   │   │   ├── Toolbar.tsx         # Drawing tools toolbar
│   │   │   ├── UserCursors.tsx     # Real-time cursor display
│   │   │   ├── UserProfile.tsx     # User profile management
│   │   │   └── Whiteboard.tsx      # Main whiteboard component
│   │   ├── utils/        # Utility functions
│   │   │   └── userSession.ts      # User session management
│   │   ├── assets/       # Static assets
│   │   ├── App.tsx       # Main application component
│   │   ├── App.css       # Global styles
│   │   ├── main.tsx      # Application entry point
│   │   └── index.css     # Base styles
│   ├── public/           # Static assets
│   ├── package.json      # Frontend dependencies
│   ├── vite.config.ts    # Vite configuration
│   └── tsconfig.json     # TypeScript configuration
├── server/               # Node.js backend
│   ├── src/             # Server source code
│   │   ├── config/      # Configuration files
│   │   │   └── index.js # Server configuration
│   │   ├── models/      # Data models
│   │   │   ├── Board.js # Board model
│   │   │   └── User.js  # User model
│   │   ├── routes/      # API routes
│   │   │   └── boards.js # Board routes
│   │   ├── services/    # Business logic
│   │   │   ├── BoardService.js # Board operations
│   │   │   └── UserService.js  # User operations
│   │   ├── socket/      # WebSocket handlers
│   │   │   └── handlers.js # Socket event handlers
│   │   └── app.js       # Express app setup
│   ├── index.js         # Server entry point
│   ├── package.json     # Backend dependencies
│   └── README.md        # Server documentation
```

## ✨ Features

### 🎨 Drawing & Design Tools

- **Shape Tools**: Rectangle, Circle, Lines with customizable colors
- **Freehand Drawing**: Pen tool for sketching and annotations
- **Text Elements**: Double-click rectangles to add editable text
- **Image Support**: Upload and embed images with drag-and-drop positioning
- **Video Support**: Embed YouTube and Vimeo videos with real-time preview
- **Zoom Controls**: Zoom in/out and reset view for detailed work

### 👥 Real-time Collaboration

- **Multi-user Support**: Multiple team members can collaborate simultaneously
- **Live Cursors**: See where other users are working in real-time
- **Online Users List**: View all currently connected users in the top-right corner
- **Real-time Sync**: All changes sync instantly across all connected users
- **User Profiles**: Each user has a unique color and customizable name
- **Persistent Sessions**: User sessions persist across page refreshes

### 🎯 Whiteboard Features

- **Interactive Canvas**: High-performance canvas with smooth drawing experience
- **Object Selection**: Click to select and transform shapes and images
- **Drag & Drop**: Move objects around the canvas with intuitive dragging
- **Board Management**: Create, name, and manage multiple whiteboard sessions
- **Export Functionality**: Export boards as PNG images (with video overlay support)

### 💻 Technical Features

- **Responsive Design**: Works on desktop with touch device support
- **Persistent Storage**: Boards are saved and accessible via unique URLs
- **WebSocket Communication**: Real-time updates using Socket.io
- **Error Handling**: Graceful handling of connection issues and file uploads
- **File Compression**: Automatic image compression for optimal performance

## 🏗️ Architecture

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Konva.js** with React-Konva for high-performance 2D canvas
- **Socket.io-client** for real-time communication
- **React Router** for navigation
- **Lucide React** for beautiful icons

### Backend

- **Node.js** with Express
- **Socket.io** for WebSocket connections
- **In-memory storage** for board state (Redis integration planned)
- **CORS** configured for cross-origin requests

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Modern web browser with WebSocket support

### Installation & Setup

1. **Clone and setup the project**
   ```bash
   git clone <repository-url>
   cd retroboard
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env if needed for custom ports
   ```

3. **Install dependencies for both frontend and backend**
   install separately:
   ```bash
   # Frontend
   cd frontend && npm install
   
   # Backend  
   cd ../server && npm install
   ```

4. **Start the development servers**
   start separately:**

   Backend (Terminal 1):
   ```bash
   npm run start
   ```

   Frontend (Terminal 2):
   ```bash
   npm run dev
   ```

5. **Access the application**
    - Frontend: `http://localhost:5173`
    - Backend API: `http://localhost:3000`

## 📖 Usage Guide

### Creating a New Board

1. From the home page, enter an optional board name
2. Click "Create New Board"
3. Share the board URL with your team members

### Using the Whiteboard

1. **Select Tools**: Use the toolbar to choose drawing tools
2. **Draw Shapes**: Click and drag to create rectangles and circles
3. **Add Text**: Select the text tool and click anywhere on the canvas
4. **Create Sticky Notes**: Use the sticky note tool for retrospective activities
5. **Collaborate**: See your teammates' cursors and changes in real-time

### Retrospective Workflow

1. **Setup Phase**: Create sections for "What went well", "What to improve", "Action items"
2. **Brainstorming**: Team members add sticky notes with their thoughts
3. **Discussion**: Use drawing tools to highlight and connect ideas
4. **Action Planning**: Create action items and assign owners

## 🛠️ Development

### Project Structure

```
retroboard/
├── README.md              # Project documentation
├── frontend/              # React + TypeScript frontend
│   ├── src/              # Source code
│   │   ├── components/   # React components
│   │   │   ├── BoardList.tsx       # Board selection interface
│   │   │   ├── DrawableShape.tsx   # Canvas shape rendering
│   │   │   ├── OnlineUsersList.tsx # Online users display
│   │   │   ├── TemplateSelector.tsx # Board template selection
│   │   │   ├── Toolbar.tsx         # Drawing tools toolbar
│   │   │   ├── UserCursors.tsx     # Real-time cursor display
│   │   │   ├── UserProfile.tsx     # User profile management
│   │   │   └── Whiteboard.tsx      # Main whiteboard component
│   │   ├── utils/        # Utility functions
│   │   │   └── userSession.ts      # User session management
│   │   ├── assets/       # Static assets
│   │   ├── App.tsx       # Main application component
│   │   ├── App.css       # Global styles
│   │   ├── main.tsx      # Application entry point
│   │   └── index.css     # Base styles
│   ├── public/           # Static assets
│   ├── package.json      # Frontend dependencies
│   ├── vite.config.ts    # Vite configuration
│   └── tsconfig.json     # TypeScript configuration
├── server/               # Node.js backend
│   ├── src/             # Server source code
│   │   ├── config/      # Configuration files
│   │   │   └── index.js # Server configuration
│   │   ├── models/      # Data models
│   │   │   ├── Board.js # Board model
│   │   │   └── User.js  # User model
│   │   ├── routes/      # API routes
│   │   │   └── boards.js # Board routes
│   │   ├── services/    # Business logic
│   │   │   ├── BoardService.js # Board operations
│   │   │   └── UserService.js  # User operations
│   │   ├── socket/      # WebSocket handlers
│   │   │   └── handlers.js # Socket event handlers
│   │   └── app.js       # Express app setup
│   ├── index.js         # Server entry point
│   ├── package.json     # Backend dependencies
│   └── README.md        # Server documentation
```

### Available Scripts

#### Frontend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

#### Backend

- `npm start` - Start the WebSocket server

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_SERVER_URL=http://localhost:3000
SERVER_PORT=3000
VITE_APP_PORT=5173
CORS_ORIGIN=http://localhost:5173
```

### CORS Configuration

The server is configured to accept requests from `http://localhost:5173`. Update the CORS settings in `server/index.js`
for production deployment.

## 📚 Dependencies

### Frontend Dependencies

- `react` & `react-dom` - UI framework
- `typescript` - Type safety
- `vite` - Build tool
- `konva` & `react-konva` - 2D canvas library
- `socket.io-client` - Real-time communication
- `react-router-dom` - Client-side routing
- `lucide-react` - Icon library
- `uuid` - Unique ID generation

### Backend Dependencies

- `express` - Web framework
- `socket.io` - WebSocket server
- `cors` - Cross-origin resource sharing
- `uuid` - Unique ID generation

## 🚀 Deployment

### Frontend Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update the API URL in environment variables

### Backend Deployment

1. Deploy the `server` folder to your hosting service
2. Set up environment variables for production
3. Configure CORS for your frontend domain

## 🔮 Roadmap

- [ ] **Database Integration**: Persistent storage with MongoDB/PostgreSQL
- [ ] **User Authentication**: Secure user accounts and board access
- [ ] **Advanced Retrospective Tools**: Templates, voting, timer
- [ ] **Export Features**: PDF, PNG, and JSON export
- [ ] **Mobile App**: React Native mobile application
- [ ] **Video Conferencing**: Integrated video calls during sessions
- [ ] **AI Assistance**: Smart suggestions and retrospective insights

---

Made with ❤️ for agile teams and retrospective facilitators
