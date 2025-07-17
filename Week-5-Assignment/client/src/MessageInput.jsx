import React, { useState } from 'react';

function MessageInput({ onSend, onTyping }) {
  const [input, setInput] = useState('');

  const handleChange = (e) => {
    setInput(e.target.value);
    onTyping(e.target.value.length > 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
      onTyping(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center' }}>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: '12px 14px',
          borderRadius: 20,
          border: '1.5px solid #cce',
          fontSize: 16,
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border 0.2s',
          background: '#f9f9fb',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '10px 22px',
          borderRadius: 20,
          border: 'none',
          background: '#4f8cff',
          color: '#fff',
          fontWeight: 600,
          fontSize: 16,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(79,140,255,0.08)',
          transition: 'background 0.2s',
        }}
      >
        Send
      </button>
    </form>
  );
}

export default MessageInput; 