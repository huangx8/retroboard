import React from 'react'
import './UserCursors.css'

interface CursorPosition {
  userId: string
  userName: string
  position: { x: number; y: number }
  color: string
}

interface UserCursorsProps {
  cursors: CursorPosition[]
  currentUserId?: string
}

const UserCursors = ({ cursors, currentUserId }: UserCursorsProps) => {
  // Filter out current user's cursor - users shouldn't see their own cursor
  const otherUsersCursors = cursors.filter(cursor => cursor.userId !== currentUserId)

  return (
    <>
      {otherUsersCursors.map((cursor) => (
        <div
          key={cursor.userId}
          className="user-cursor"
          style={{
            left: cursor.position.x,
            top: cursor.position.y,
            transform: 'translate(-2px, -2px)'
          }}
        >
          <div className="cursor-pointer" style={{ backgroundColor: cursor.color }}>
            <div className="cursor-arrow" style={{ borderRightColor: cursor.color }} />
          </div>
          <div className="cursor-label" style={{ backgroundColor: cursor.color }}>
            {cursor.userName}
          </div>
        </div>
      ))}
    </>
  )
}

export default UserCursors
