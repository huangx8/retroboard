import './UserCursors.css'

interface CursorPosition {
  userId: string
  userName: string
  position: { x: number; y: number }
  color: string
}

interface UserCursorsProps {
  cursors: CursorPosition[]
}

const UserCursors = ({ cursors }: UserCursorsProps) => {
  return (
    <div className="user-cursors">
      {cursors.map((cursor) => (
        <div
          key={cursor.userId}
          className="user-cursor"
          style={{
            left: cursor.position.x,
            top: cursor.position.y,
            borderColor: cursor.color
          }}
        >
          <div 
            className="cursor-pointer"
            style={{ backgroundColor: cursor.color }}
          />
          <div 
            className="cursor-label"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.userName}
          </div>
        </div>
      ))}
    </div>
  )
}

export default UserCursors
