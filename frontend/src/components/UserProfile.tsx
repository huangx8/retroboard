import { useState, useEffect, useRef } from 'react'
import { Edit, Check, X, User as UserIcon, Palette } from 'lucide-react'
import { updateUserSession } from '../utils/userSession'
import type { User } from '../utils/userSession'
import './UserProfile.css'

interface UserProfileProps {
  user: User | null
  onUserUpdate: (user: User) => void
  isConnected?: boolean
}

const UserProfile = ({ user, onUserUpdate, isConnected = false }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(user?.name || '')
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const colorPickerRef = useRef<HTMLDivElement>(null)

  const predefinedColors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FECA57', // Yellow
    '#FF9FF3', // Pink
    '#54A0FF', // Light Blue
    '#5F27CD', // Purple
    '#00D2D3', // Cyan
    '#FF9F43', // Orange
    '#10AC84', // Emerald
    '#EE5A24', // Dark Orange
  ]

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsColorPickerOpen(false)
      }
    }

    if (isColorPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isColorPickerOpen])

  if (!user) return null

  const handleSave = () => {
    if (editName.trim() && editName !== user.name) {
      const updatedUser = updateUserSession({ name: editName.trim() })
      onUserUpdate(updatedUser)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditName(user.name)
    setIsEditing(false)
  }

  const handleColorChange = (newColor: string) => {
    const updatedUser = updateUserSession({ color: newColor })
    onUserUpdate(updatedUser)
    setIsColorPickerOpen(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div className="user-profile">
      <div className="user-avatar-container">
        <div 
          className="user-avatar"
          style={{ backgroundColor: user.color }}
          title={`${isConnected ? 'Online' : 'Offline'} • Click to change color • User ID: ${user.id.slice(0, 8)}`}
          onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
        >
          <UserIcon size={16} />
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`} />
        </div>
        
        {isColorPickerOpen && (
          <div className="color-picker" ref={colorPickerRef}>
            <div className="color-picker-title">Choose Color</div>
            <div className="color-options">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  className={`color-option ${user.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="user-edit">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter your name"
            className="user-name-input"
            autoFocus
            maxLength={20}
          />
          <div className="edit-actions">
            <button 
              className="edit-btn save" 
              onClick={handleSave}
              title="Save"
            >
              <Check size={14} />
            </button>
            <button 
              className="edit-btn cancel" 
              onClick={handleCancel}
              title="Cancel"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="user-display">
          <span className="user-name">{user.name}</span>
          <button 
            className="edit-btn" 
            onClick={() => {
              setEditName(user.name)
              setIsEditing(true)
            }}
            title="Edit name"
          >
            <Edit size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

export default UserProfile
