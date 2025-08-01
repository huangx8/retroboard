const Board = require('../models/Board');

class BoardService {
  constructor() {
    this.boards = new Map();
  }

  getAllBoards() {
    // Convert the Map to an array of boards with summary info
    const boardList = Array.from(this.boards.values()).map(board => board.toSummary());

    // Sort by last modified (most recent first)
    boardList.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());

    return boardList;
  }

  getBoard(boardId) {
    let board = this.boards.get(boardId);

    if (!board) {
      board = new Board();
      board.id = boardId;
      this.boards.set(boardId, board);
    }

    return board;
  }

  createBoard(name = null, template = null) {
    const board = new Board(name);

    // If a template is provided, create initial objects based on template sections
    if (template && template.sections && template.sections.length > 0) {
      const initialObjects = this.createTemplateObjects(template.sections);
      board.objects = initialObjects;
    }

    this.boards.set(board.id, board);
    return board;
  }

  createTemplateObjects(sections) {
    const { v4: uuidv4 } = require('uuid');

    return sections.map(section => ({
      id: uuidv4(),
      type: 'rectangle',
      x: section.x,
      y: section.y,
      width: 250,
      height: 150,
      fill: section.color,
      stroke: '#333',
      strokeWidth: 2,
      text: section.title,
      fontSize: 16,
      createdAt: new Date(),
      createdBy: 'system'
    }));
  }

  deleteBoard(boardId) {
    const board = this.boards.get(boardId);
    if (!board) {
      return null;
    }

    this.boards.delete(boardId);
    return board;
  }

  boardExists(boardId) {
    return this.boards.has(boardId);
  }
}

// Singleton instance
const boardService = new BoardService();

module.exports = boardService;
