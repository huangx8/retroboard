const User = require('../models/User');

class UserService {
  constructor() {
    this.users = new Map();
  }

  addUser(userData, socketId, boardId) {
    const user = new User(userData, socketId, boardId);
    this.users.set(socketId, user);
    return user;
  }

  getUser(socketId) {
    return this.users.get(socketId);
  }

  updateUser(socketId, userData) {
    const user = this.users.get(socketId);
    if (user) {
      user.update(userData);
      return user;
    }
    return null;
  }

  removeUser(socketId) {
    const user = this.users.get(socketId);
    if (user) {
      this.users.delete(socketId);
      return user;
    }
    return null;
  }

  getUsersByBoard(boardId) {
    return Array.from(this.users.values()).filter(user => user.boardId === boardId);
  }

  userExists(socketId) {
    return this.users.has(socketId);
  }
}

// Singleton instance
const userService = new UserService();

module.exports = userService;
