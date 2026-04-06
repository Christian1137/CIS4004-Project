import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Trainer'); // either Administrator or Trainer

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = isLogin
      ? { username, password }
      : { username, password, role: userType };

    try {
      // ADDED: Full localhost URL to prevent port mismatch errors
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // --- NEW: SAVE TO LOCAL STORAGE ---
        // This permanently remembers the user until they log out!
        localStorage.setItem('currentUserId', data.userId);
        localStorage.setItem('currentUsername', data.username);
        localStorage.setItem('currentUserRole', data.role);

        // Pass the full data to your AuthContext just in case it needs it
        login({ userId: data.userId, username: data.username, role: data.role });

        if (isLogin) {
          alert(`Welcome back, ${data.username}!`);
        } else {
          alert("Account created and logged in!");
        }
        navigate('/team-build');
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Connection error:", err);
      alert("Could not connect to the server.");
    }
  };

  return (
    <main style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h1>{isLogin ? 'Login' : 'Create Account'}</h1>

      <form onSubmit={handleSubmit} aria-label={isLogin ? 'Login Form' : 'Registration Form'}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block' }}>Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block' }}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* user selection */}
        {!isLogin && (
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="userType" style={{ display: 'block' }}>Account Type</label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="Trainer">Trainer</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
        )}

        <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        style={{ marginTop: '20px', background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
      >
        {isLogin ? "Don't have an account? Register here" : "Return to Login"}
      </button>
    </main>
  );
};

export default LoginPage;