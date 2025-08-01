const boardService = require('../services/BoardService');
const userService = require('../services/UserService');

const handleConnection = (io, socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a board room
  socket.on('join-board', (data) => {
    const { boardId, user } = data;

    // Store user info
    const userObj = userService.addUser(user, socket.id, boardId);

    // Join the board room
    socket.join(boardId);

    // Send current board state
    const board = boardService.getBoard(boardId);
    socket.emit('board-state', board);

    // Get all active users in this board and send to the newly joined user
    const activeUsers = userService.getUsersByBoard(boardId);
    socket.emit('active-users', {
      users: activeUsers.map(u => ({
        userId: u.id,
        userName: u.name,
        color: u.color,
        // Default position for users who haven't moved their cursor yet
        position: { x: 0, y: 0 }
      }))
    });

    // Notify others of new user
    socket.to(boardId).emit('user-joined', {
      user: userObj.toJSON(),
      timestamp: new Date()
    });

    console.log(`User ${user.name} joined board ${boardId}`);
  });

  // Handle canvas object operations
  socket.on('object-add', (data) => {
    try {
      const user = userService.getUser(socket.id);
      if (!user) {
        console.log('No user found for socket:', socket.id);
        return;
      }

      const board = boardService.getBoard(user.boardId);

      // Log image uploads for debugging
      if (data.object.type === 'image') {
        console.log(`User ${user.name} uploading image, size: ${data.object.src ? Math.round(data.object.src.length / 1024) : 0}KB`);
      }

      const objectWithId = board.addObject(data.object, user);

      // Broadcast to all users in the board
      io.to(user.boardId).emit('object-added', {
        object: objectWithId,
        user: user.toJSON()
      });

      if (data.object.type === 'image') {
        console.log(`Image successfully added to board ${user.boardId}`);
      }
    } catch (error) {
      console.error('Error in object-add handler:', error);
      socket.emit('error', { message: 'Failed to add object' });
    }
  });

  socket.on('object-update', (data) => {
    const user = userService.getUser(socket.id);
    if (!user) return;

    const board = boardService.getBoard(user.boardId);
    const updatedObject = board.updateObject(data.objectId, data.updates, user);

    if (updatedObject) {
      // Broadcast to other users (not the sender)
      socket.to(user.boardId).emit('object-updated', {
        objectId: data.objectId,
        updates: data.updates,
        user: user.toJSON()
      });
    }
  });

  socket.on('object-delete', (data) => {
    const user = userService.getUser(socket.id);
    if (!user) return;

    const board = boardService.getBoard(user.boardId);
    const deletedObject = board.deleteObject(data.objectId);

    if (deletedObject) {
      // Broadcast to all users in the board
      io.to(user.boardId).emit('object-deleted', {
        objectId: data.objectId,
        user: user.toJSON()
      });
    }
  });

  // Handle clear board operation
  socket.on('clear-board', () => {
    const user = userService.getUser(socket.id);
    if (!user) return;

    const board = boardService.getBoard(user.boardId);
    board.clearObjects();

    // Broadcast to all users in the board
    io.to(user.boardId).emit('board-cleared', {
      user: user.toJSON()
    });
  });

  // Handle cursor movement for collaborative indicators
  socket.on('cursor-move', (data) => {
    const user = userService.getUser(socket.id);
    if (!user) return;

    socket.to(user.boardId).emit('cursor-moved', {
      userId: user.id,
      userName: user.name,
      position: data.position,
      color: user.color
    });
  });

  // Handle text editing state
  socket.on('text-editing-start', (data) => {
    const user = userService.getUser(socket.id);
    if (!user) return;

    socket.to(user.boardId).emit('text-editing-started', {
      objectId: data.objectId,
      user: user.toJSON()
    });
  });

  socket.on('text-editing-end', (data) => {
    const user = userService.getUser(socket.id);
    if (!user) return;

    socket.to(user.boardId).emit('text-editing-ended', {
      objectId: data.objectId,
      user: user.toJSON()
    });
  });

  // Handle user profile updates
  socket.on('user-update', (data) => {
    const user = userService.updateUser(socket.id, data.user);
    if (!user) return;

    // Broadcast the user update to other users in the board
    socket.to(user.boardId).emit('user-updated', {
      user: user.toJSON(),
      timestamp: new Date()
    });

    console.log(`User ${user.name} updated their profile in board ${user.boardId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = userService.removeUser(socket.id);
    if (user) {
      // Notify others in the board
      socket.to(user.boardId).emit('user-left', {
        user: user.toJSON(),
        timestamp: new Date()
      });

      console.log(`User ${user.name} left board ${user.boardId}`);
    }

    console.log(`User disconnected: ${socket.id}`);
  });
};

module.exports = { handleConnection };
