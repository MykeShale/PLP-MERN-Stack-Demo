import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const { signup, loading, error, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!username.trim() || !password.trim()) {
      setFormError('Username and password required');
      return;
    }
    if (username.length < 3 || username.length > 32) {
      setFormError('Username must be 3-32 characters');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setFormError('Username can only contain letters, numbers, and underscores');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    const ok = await signup(username, password);
    if (ok) navigate('/');
  };

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 style={{textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', marginBottom: '8px'}}>Sign Up</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>Sign Up</button>
        {(formError || error) && <div className="error">{formError || error}</div>}
        {loading && <div className="spinner"></div>}
        <div style={{textAlign: 'center', fontSize: '1rem', marginTop: '4px'}}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup; 