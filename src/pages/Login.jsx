import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Reset form on mount to ensure clean state
    setUsername('');
    setPassword('');
    setError('');
  }, []);

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
      {/* 8-bit decorative elements */}
      <div className="pixel-decoration pixel-top-left"></div>
      <div className="pixel-decoration pixel-top-right"></div>
      <div className="pixel-decoration pixel-bottom-left"></div>
      <div className="pixel-decoration pixel-bottom-right"></div>
      
      <div className="login-container">
        <div className="logo-wrapper">
          <div className="pixel-logo-accent"></div>
          <h1 className="login-logo">
            <span className="logo-bracket">[</span>
            Tasklify
            <span className="logo-bracket">]</span>
          </h1>
          <div className="pixel-logo-accent-bottom"></div>
        </div>
        <p className="login-tagline">
          <span className="pixel-cursor">▸</span> Task Management Made Simple
        </p>
        
        <div className="login-card">
          <div className="card-header">
            <div className="pixel-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <h2>
              <span className="terminal-prompt">&gt;_</span> Login
            </h2>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="login-field">
              <label>
                <span className="field-icon">👤</span>
                Username:
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="user"
                  required
                />
                <span className="input-border-accent"></span>
              </div>
            </div>

            <div className="login-field">
              <label>
                <span className="field-icon">🔒</span>
                Password:
              </label>
              <div className="input-wrapper">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  required
                />
                <span className="input-border-accent"></span>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <button type="submit" className="login-submit-btn">
              <span className="btn-pixel-left"></span>
              <span className="btn-text">[ LOGIN ]</span>
              <span className="btn-pixel-right"></span>
            </button>
          </form>
        </div>
        
        <div className="login-footer">
          <div className="pixel-divider"></div>
          <p className="footer-text">
            <span className="blink">█</span> Press LOGIN to continue...
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
