import React, { useState } from 'react';
import './LoginBox.css';

function LoginBox() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login:', { username, password });
  };

  return (
    <div className="login-box">
      <form onSubmit={handleLogin}>
        <div className="login-field">
          <label>usgi:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="login-field">
          <label>pwd:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginBox;
