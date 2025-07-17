import React from 'react';

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 70%)`;
}

function UserList({ users, currentUser, onSelectUser, currentChat, onSelectGlobal, unread }) {
  return (
    <div className="userlist">
      <h4 className="userlist-title">Online Users</h4>
      <ul className="userlist-ul">
        <li
          className={`userlist-li${currentChat.type === 'global' ? ' me' : ''}`}
          style={{ cursor: 'pointer', background: currentChat.type === 'global' ? '#e0e7ff' : 'none' }}
          onClick={onSelectGlobal}
        >
          <div className="userlist-avatar" style={{ background: '#4f8cff' }}>#</div>
          <span className="userlist-name">Global Chat</span>
        </li>
        {users.map((user) => {
          const isMe = user.username === currentUser;
          if (isMe) return null;
          const isActive = currentChat.type === 'private' && currentChat.user.username === user.username;
          return (
            <li
              key={user.id}
              className={`userlist-li${isActive ? ' me' : ''}`}
              style={{ cursor: 'pointer', background: isActive ? '#e0e7ff' : 'none', position: 'relative' }}
              onClick={() => onSelectUser(user)}
            >
              <div className="userlist-avatar" style={{ background: stringToColor(user.username) }}>
                {user.username[0]?.toUpperCase()}
              </div>
              <span className="userlist-name">{user.username}</span>
              {unread && unread[user.username] > 0 && (
                <span style={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  background: '#e74c3c',
                  color: '#fff',
                  borderRadius: '50%',
                  fontSize: 12,
                  fontWeight: 700,
                  minWidth: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 6px',
                  zIndex: 10,
                }}>{unread[user.username]}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default UserList; 