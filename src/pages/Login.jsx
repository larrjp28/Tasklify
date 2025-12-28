import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Default credentials (temporary)
    if (username === 'user' && password === 'password') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Try: user / password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-logo">Tasklify</h1>
        <p className="login-tagline">Task Management Made Simple</p>
        
        <div className="login-card">
          <h2>Login</h2>
          
          <form onSubmit={handleLogin}>
            <div className="login-field">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="user"
                required
              />
            </div>

            <div className="login-field">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="login-submit-btn">
              Login
            </button>
          </form>

          <div className="login-hint">
            <small>Default: user / password</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
