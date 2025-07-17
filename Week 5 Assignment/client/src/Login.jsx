import React, { useState } from 'react';

function Login({ onLogin }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const endpoint = isRegister
        ? 'http://localhost:5000/api/register'
        : 'http://localhost:5000/api/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        if (isRegister) {
          setSuccess('Registration successful! You can now log in.');
          setIsRegister(false);
        } else {
          onLogin(name);
        }
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h2 className="login-title">{isRegister ? 'Register' : 'Login'} to Chat</h2>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <input
          type="text"
          placeholder="Enter your username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="login-input"
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          autoComplete={isRegister ? 'new-password' : 'current-password'}
        />
        <button
          type="submit"
          className="login-btn"
          disabled={loading}
        >
          {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <div className="login-error">{error}</div>
      <div className="login-success">{success}</div>
      <div className="login-switch">
        {isRegister ? (
          <span>
            Already have an account?{' '}
            <button type="button" onClick={() => { setIsRegister(false); setError(''); setSuccess(''); }} className="login-switch-btn">
              Login
            </button>
          </span>
        ) : (
          <span>
            Don&apos;t have an account?{' '}
            <button type="button" onClick={() => { setIsRegister(true); setError(''); setSuccess(''); }} className="login-switch-btn">
              Register
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

export default Login; 