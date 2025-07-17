import React, { useEffect, useRef, useState } from 'react';

// Helper to get a color from a string (for user avatars)
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 70%)`;
  return color;
}

const REACTIONS = ['👍', '❤️', '😂', '😮', '🎉'];

function MessageList({ messages, onReact, onRead, currentUser }) {
  const listRef = useRef(null);
  const [showReactions, setShowReactions] = useState(null); // message id

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Mark messages as read when rendered (for private chat)
    if (onRead) {
      const unread = messages.filter((msg) => !msg.read && msg.receiver === currentUser);
      if (unread.length > 0) {
        onRead(unread.map((msg) => msg.id));
      }
    }
  }, [messages, onRead, currentUser]);

  return (
    <div ref={listRef} className="messagelist">
      {messages.map((msg) => {
        const isMe = msg.sender === currentUser;
        const isSystem = msg.system;
        return (
          <div
            key={msg.id}
            className={`message-row${isMe ? ' me' : ''}`}
            onMouseLeave={() => setShowReactions(null)}
          >
            {/* Avatar or system icon */}
            <div className="message-avatar" style={{ background: isSystem ? '#ccc' : stringToColor(msg.sender || '') }}>
              {isSystem ? '!' : (msg.sender || '?')[0]?.toUpperCase()}
            </div>
            {/* Chat bubble */}
            <div
              className={`message-bubble${isSystem ? ' system' : ''}`}
              onClick={() => !isSystem && setShowReactions(msg.id)}
              style={{ cursor: isSystem ? 'default' : 'pointer', position: 'relative' }}
            >
              <div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 2, opacity: isSystem ? 0.7 : 1 }}>
                {isSystem ? 'System' : msg.sender}
              </div>
              <div>{msg.message}</div>
              <div className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</div>
              {/* Reactions */}
              {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                <div style={{ marginTop: 4, display: 'flex', gap: 6 }}>
                  {Object.entries(msg.reactions).map(([emoji, users]) => (
                    <span key={emoji} style={{ fontSize: 18, background: '#eee', borderRadius: 8, padding: '0 6px', fontWeight: 600 }}>
                      {emoji} {users.length}
                    </span>
                  ))}
                </div>
              )}
              {/* Reaction picker */}
              {showReactions === msg.id && !isSystem && (
                <div style={{ position: 'absolute', bottom: 36, left: 0, background: '#fff', border: '1px solid #eee', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', gap: 6, padding: 6, zIndex: 10 }}>
                  {REACTIONS.map((emoji) => (
                    <span
                      key={emoji}
                      style={{ fontSize: 22, cursor: 'pointer' }}
                      onClick={() => { setShowReactions(null); onReact && onReact(msg.id, emoji); }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
              {/* Read receipt */}
              {msg.isPrivate && isMe && msg.read && (
                <div style={{ fontSize: 11, color: '#27ae60', marginTop: 2 }}>Seen</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MessageList; 