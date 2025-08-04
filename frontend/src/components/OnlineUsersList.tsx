import React from 'react';
import './OnlineUsersList.css';

interface User {
  userId: string;
  userName: string;
  color: string;
}

interface OnlineUsersListProps {
  users: User[];
  currentUserId: string;
}

const OnlineUsersList: React.FC<OnlineUsersListProps> = ({ users, currentUserId }) => {
  // Ensure current user is always included and sort users with current user first
  const sortedUsers = [...users].sort((a, b) => {
    if (a.userId === currentUserId) return -1;
    if (b.userId === currentUserId) return 1;
    return a.userName.localeCompare(b.userName);
  });

  return (
    <div className="online-users-list">
      <div className="online-users-header">
        <span className="online-indicator">●</span>
        Online ({sortedUsers.length})
      </div>
      <div className="users-container">
        {sortedUsers.map(user => (
          <div
            key={user.userId}
            className={`user-item ${user.userId === currentUserId ? 'current-user' : ''}`}
          >
            <div
              className="user-avatar"
              style={{ backgroundColor: user.color }}
            >
              {user.userName.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">
              {user.userName}
              {user.userId === currentUserId && ' (You)'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineUsersList;
