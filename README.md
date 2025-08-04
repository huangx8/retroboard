# 🎯 RetroBoard - Collaborative Whiteboard for Retrospectives

A real-time collaborative whiteboard application designed specifically for agile retrospectives and team brainstorming sessions. Built with React, TypeScript, Socket.io, and Konva.js.

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
- **High-Quality Images**: Automatic image optimization with DPI handling

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Konva.js** with React-Konva for high-performance 2D canvas
- **Socket.io-client** for real-time communication
- **React Router** for navigation
- **Lucide React** for beautiful icons

### Backend
- **Node.js** with Express.js
- **Socket.io** for real-time WebSocket communication
- **In-memory storage** for board state and user sessions
- **CORS enabled** for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with Canvas support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd retroboard
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Development

1. **Start the backend server**
   ```bash
   cd server
   npm start
   ```
   Server will run on http://localhost:3000

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on http://localhost:5173

3. **Open your browser**
   Navigate to http://localhost:5173 to start using RetroBoard

## 🎮 Usage

### Creating a Board
1. Click "Create New Board" on the homepage
2. Enter a board name
3. Start drawing and collaborating!

### Drawing Tools
- **Select Tool**: Click and drag to move objects
- **Rectangle/Circle**: Click to create shapes
- **Pen Tool**: Draw freehand lines
- **Image Tool**: Upload and place images
- **Video Tool**: Embed YouTube/Vimeo videos

### Collaboration
- Share the board URL with team members
- See live cursors of other users
- View online users in the top-right list
- Changes sync in real-time

### Advanced Features
- **Text**: Double-click rectangles to add text
- **Context Menu**: Right-click objects for additional options
- **Zoom**: Use mouse wheel or toolbar controls
- **Export**: Save boards as PNG images

## 🛠️ Development

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

#### Backend
- `npm start` - Start server
- `npm run dev` - Start with nodemon (auto-restart)

### Project Structure Details

- **Components**: Modular React components with individual CSS files
- **Utils**: Helper functions for user session management
- **Socket Handlers**: Real-time communication logic
- **Services**: Business logic for boards and users
- **Models**: Data structures for application entities

## 🔧 Configuration

### Environment Variables

Create `.env` files in both frontend and server directories:

**Frontend (.env)**
```
VITE_SERVER_URL=http://localhost:3000
```

**Server (.env)**
```
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React and Konva.js for high-performance canvas rendering
- Socket.io for seamless real-time collaboration
- Vite for lightning-fast development experience
