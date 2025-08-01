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
  if (users.length === 0) return null;

  return (
    <div className="online-users-list">
      <div className="online-users-header">
        <span className="online-indicator"></span>
        <span>Online ({users.length})</span>
      </div>
      <ul>
        {users.map(user => (
          <li key={user.userId} className={user.userId === currentUserId ? 'current-user' : ''}>
            <span className="user-color-dot" style={{ backgroundColor: user.color }}></span>
            <span className="user-name">{user.userName}{user.userId === currentUserId ? ' (You)' : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsersList;
