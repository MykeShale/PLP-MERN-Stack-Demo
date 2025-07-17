import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login, loading, error, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!username.trim() || !password.trim()) {
      setFormError('Username and password required');
      return;
    }
    const ok = await login(username, password);
    if (ok) navigate('/');
  };

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 style={{textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', marginBottom: '8px'}}>Login</h2>
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
        <button type="submit" disabled={loading}>Login</button>
        {(formError || error) && <div className="error">{formError || error}</div>}
        {loading && <div className="spinner"></div>}
        <div style={{textAlign: 'center', fontSize: '1rem', marginTop: '4px'}}>
          No account? <Link to="/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login; 