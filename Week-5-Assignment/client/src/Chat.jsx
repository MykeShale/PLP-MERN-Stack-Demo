import React, { useEffect, useState } from 'react';
import { useSocket } from './socket/socket';
import UserList from './UserList.jsx';
import MessageList from './MessageList.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import MessageInput from './MessageInput.jsx';

function Chat({ username, onLogout }) {
  const {
    connect,
    disconnect,
    users,
    messages,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    typingUsers,
    unread,
    setUnread,
    showNotification,
  } = useSocket();

  const [currentChat, setCurrentChat] = useState({ type: 'global' }); // {type: 'global'} or {type: 'private', user: {}}
  const [inAppNotification, setInAppNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('chat_username', username); // Store for UI highlighting
    connect(username);
    return () => {
      disconnect();
      localStorage.removeItem('chat_username');
    };
    // eslint-disable-next-line
  }, [username]);

  // When switching to a private chat, reset unread count
  useEffect(() => {
    if (currentChat.type === 'private') {
      setUnread((prev) => ({ ...prev, [currentChat.user.username]: 0 }));
    }
  }, [currentChat, setUnread]);

  // In-app notification for new private messages
  useEffect(() => {
    const handle = (e) => {
      if (e.detail && e.detail.type === 'private_message') {
        setInAppNotification({
          from: e.detail.from,
          message: e.detail.message,
        });
        setTimeout(() => setInAppNotification(null), 4000);
      }
    };
    window.addEventListener('in-app-notification', handle);
    return () => window.removeEventListener('in-app-notification', handle);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('chat_username');
    if (onLogout) onLogout();
  };

  // Filter messages for current chat
  const filteredMessages = messages.filter((msg) => {
    if (currentChat.type === 'global') {
      return !msg.isPrivate;
    } else if (currentChat.type === 'private') {
      // Show private messages between me and selected user
      return (
        msg.isPrivate &&
        ((msg.sender === username && msg.receiver === currentChat.user.username) ||
         (msg.sender === currentChat.user.username && msg.receiver === username))
      );
    }
    return true;
  });

  // Send message handler
  const handleSend = (text) => {
    if (currentChat.type === 'global') {
      sendMessage(text);
    } else if (currentChat.type === 'private') {
      sendPrivateMessage(currentChat.user.id, text);
    }
  };

  // Handle message reaction
  const handleReact = (msgId, emoji) => {
    // Emit reaction event to server
    if (window && window.socket) {
      window.socket.emit('react_message', { msgId, emoji, user: username });
    }
  };

  // Handle read receipts
  const handleRead = (msgIds) => {
    if (window && window.socket) {
      window.socket.emit('read_messages', { msgIds, user: username });
    }
  };

  return (
    <div className="app-container" style={{ transition: 'background 0.4s' }}>
      {inAppNotification && (
        <div style={{
          position: 'fixed',
          top: 80,
          right: 30,
          background: '#4f8cff',
          color: '#fff',
          padding: '14px 24px',
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          zIndex: 2000,
          fontWeight: 600,
          fontSize: 16,
        }}>
          New message from <b>{inAppNotification.from}</b>: {inAppNotification.message}
        </div>
      )}
      <div className="card" style={{ transition: 'background 0.4s, box-shadow 0.4s' }}>
        <div className="header">
          <h2 className="header-title">
            {currentChat.type === 'global'
              ? 'Chat Room'
              : `Private Chat with ${currentChat.user.username}`}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span className="header-user">Logged in as <b>{username}</b></span>
            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', flex: 1, minHeight: 0, padding: 24, gap: 24 }}>
          <UserList
            users={users}
            currentUser={username}
            onSelectUser={(user) => setCurrentChat({ type: 'private', user })}
            currentChat={currentChat}
            onSelectGlobal={() => setCurrentChat({ type: 'global' })}
            unread={unread}
          />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <MessageList
              messages={filteredMessages}
              onReact={handleReact}
              onRead={currentChat.type === 'private' ? handleRead : undefined}
              currentUser={username}
            />
            <TypingIndicator typingUsers={typingUsers} currentUser={username} />
            <MessageInput onSend={handleSend} onTyping={setTyping} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat; 