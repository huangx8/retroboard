import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './BoardList.css'

interface Board {
  id: string
  name: string
  lastModified: string
  objectCount: number
  createdAt: string
}

const BoardList = () => {
  const [boards, setBoards] = useState<Board[]>([])
  const [newBoardName, setNewBoardName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'}/api/boards`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch boards')
      }
      
      const boardData = await response.json()
      setBoards(boardData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch boards')
      console.error('Error fetching boards:', err)
    } finally {
      setLoading(false)
    }
  }

  const createNewBoard = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'}/api/boards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newBoardName || `Retro Board ${boards.length + 1}`
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create board')
      }

      const newBoard = await response.json()
      navigate(`/board/${newBoard.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create board')
      console.error('Error creating board:', err)
    }
  }

  const joinBoard = (boardId: string) => {
    navigate(`/board/${boardId}`)
  }

  const deleteBoard = async (boardId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'}/api/boards/${boardId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete board')
      }
      
      // Remove from local state after successful deletion
      setBoards(prev => prev.filter(board => board.id !== boardId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete board')
      console.error('Error deleting board:', err)
    }
  }

  return (
    <div className="board-list">
      <header className="board-list-header">
        <h1>🎯 RetroBoard</h1>
        <p>Collaborative whiteboard for retrospectives</p>
      </header>

      <div className="create-board-section">
        <div className="create-board-form">
          <input
            type="text"
            placeholder="Board name (optional)"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createNewBoard()}
          />
          <button onClick={createNewBoard} className="create-btn">
            Create New Board
          </button>
        </div>
      </div>

      <div className="boards-grid">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner">⏳</div>
            <p>Loading boards...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>Error loading boards</h3>
            <p>{error}</p>
            <button onClick={fetchBoards} className="retry-btn">
              Try Again
            </button>
          </div>
        ) : boards.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No boards yet</h3>
            <p>Create your first board to get started</p>
          </div>
        ) : (
          boards.map((board) => (
            <div
              key={board.id}
              className="board-card"
              onClick={() => joinBoard(board.id)}
            >
              <div className="board-preview">
                <div className="board-placeholder">
                  <span>🎨</span>
                  <div className="board-stats">
                    <small>{board.objectCount} objects</small>
                  </div>
                </div>
              </div>
              <div className="board-info">
                <h3>{board.name}</h3>
                <p className="last-modified">
                  Last modified: {new Date(board.lastModified).toLocaleDateString()}
                </p>
                <p className="created-date">
                  Created: {new Date(board.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                className="delete-btn"
                onClick={(e) => deleteBoard(board.id, e)}
                title="Delete board"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      <footer className="board-list-footer">
        <p>💡 Perfect for Sprint Retrospectives, Team Planning, and Brainstorming</p>
      </footer>
    </div>
  )
}

export default BoardList
