const express = require('express');
const router = express.Router();
const boardService = require('../services/BoardService');

// GET /api/boards - Get all boards
router.get('/', (req, res) => {
  try {
    const boards = boardService.getAllBoards();
    res.json(boards);
  } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
});

// GET /api/boards/:id - Get specific board
router.get('/:id', (req, res) => {
  try {
    const boardId = req.params.id;
    const board = boardService.getBoard(boardId);
    res.json(board);
  } catch (error) {
    console.error('Error fetching board:', error);
    res.status(500).json({ error: 'Failed to fetch board' });
  }
});

// POST /api/boards - Create new board
router.post('/', (req, res) => {
  try {
    const { name, template } = req.body;
    const board = boardService.createBoard(name, template);
    res.json(board);
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({ error: 'Failed to create board' });
  }
});

// DELETE /api/boards/:id - Delete board
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const deletedBoard = boardService.deleteBoard(id);
    if (!deletedBoard) {
      return res.status(404).json({ error: 'Board not found' });
    }

    // Notify all users in this board room that the board was deleted
    if (req.io) {
      req.io.to(id).emit('board-deleted', { boardId: id });
    }

    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

module.exports = router;
