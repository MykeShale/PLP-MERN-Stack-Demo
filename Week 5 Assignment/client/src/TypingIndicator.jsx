import React from 'react';

function TypingIndicator({ typingUsers, currentUser }) {
  const othersTyping = typingUsers.filter((u) => u !== currentUser);
  if (othersTyping.length === 0) return null;
  return (
    <div style={{ minHeight: 28, color: '#4f8cff', fontStyle: 'italic', display: 'flex', alignItems: 'center', margin: '8px 0 0 0', fontWeight: 500 }}>
      <span>{othersTyping.join(', ')} {othersTyping.length === 1 ? 'is' : 'are'} typing</span>
      <span style={{ display: 'inline-block', marginLeft: 6 }}>
        <span style={{
          display: 'inline-block',
          width: 6,
          height: 6,
          background: '#4f8cff',
          borderRadius: '50%',
          marginRight: 2,
          animation: 'blink 1s infinite alternate',
        }} />
        <span style={{
          display: 'inline-block',
          width: 6,
          height: 6,
          background: '#4f8cff',
          borderRadius: '50%',
          marginRight: 2,
          animation: 'blink 1s infinite alternate 0.2s',
        }} />
        <span style={{
          display: 'inline-block',
          width: 6,
          height: 6,
          background: '#4f8cff',
          borderRadius: '50%',
          animation: 'blink 1s infinite alternate 0.4s',
        }} />
      </span>
      <style>{`
        @keyframes blink {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default TypingIndicator; 