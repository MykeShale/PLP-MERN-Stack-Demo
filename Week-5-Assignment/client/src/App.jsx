import React, { useState } from 'react';
import Login from './Login.jsx';
import Chat from './Chat.jsx';
import './App.css';
import { ThemeProvider, useTheme } from './ThemeContext.jsx';

function AppContent() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  const handleLogin = (name) => {
    setUsername(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUsername('');
    setIsLoggedIn(false);
  };

  return (
    <div className={darkMode ? 'app-container dark' : 'app-container'}>
      <button
        onClick={toggleDarkMode}
        style={{
          position: 'fixed',
          top: 18,
          right: 18,
          zIndex: 1000,
          background: darkMode ? '#232a36' : '#fff',
          color: darkMode ? '#7ab8ff' : '#4f8cff',
          border: '1.5px solid #4f8cff',
          borderRadius: 20,
          padding: '8px 18px',
          fontWeight: 600,
          fontSize: 15,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(79,140,255,0.08)',
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
      {isLoggedIn ? (
        <Chat username={username} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
} 