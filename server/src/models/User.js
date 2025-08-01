class User {
  constructor(userData, socketId, boardId) {
    this.id = userData.id;
    this.name = userData.name;
    this.color = userData.color;
    this.avatar = userData.avatar;
    this.socketId = socketId;
    this.boardId = boardId;
    this.joinedAt = new Date();
  }

  update(userData) {
    // Update user properties while preserving system fields
    if (userData.name !== undefined) this.name = userData.name;
    if (userData.color !== undefined) this.color = userData.color;
    if (userData.avatar !== undefined) this.avatar = userData.avatar;
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      avatar: this.avatar,
      socketId: this.socketId,
      boardId: this.boardId,
      joinedAt: this.joinedAt
    };
  }
}

module.exports = User;
