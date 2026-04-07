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
    <main style={{ maxWidth: '450px', margin: '60px auto', textAlign: 'center', padding: '0 20px', boxSizing: 'border-box' }}>
      <h1 style={{ marginBottom: '30px', fontSize: '32px' }}>{isLogin ? 'Login' : 'Create Account'}</h1>
      
      {/* Added flexbox here to perfectly center the static-sized boxes */}
      <form onSubmit={handleSubmit} aria-label={isLogin ? 'Login Form' : 'Registration Form'} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ marginBottom: '20px' }}>
          {/* Label width matches input width to keep text left-aligned with the box */}
          <label htmlFor="username" style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '16px', textAlign: 'left', width: '350px' }}>Username</label>
          <input 
            id="username"
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={{ width: '450px', padding: '20px', fontSize: '16px', borderRadius: '8px', border: '2px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '16px', textAlign: 'left', width: '350px' }}>Password</label>
          <input 
            id="password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '450px', padding: '20px', fontSize: '16px', borderRadius: '8px', border: '2px solid #ccc', boxSizing: 'border-box' }}
          /> 
        </div>

        {/* user selection */}
        {!isLogin && (
          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="userType" style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '16px', textAlign: 'left', width: '350px' }}>Account Type</label>
            <select 
              id="userType"
              value={userType} 
              onChange={(e) => setUserType(e.target.value)}
              style={{ width: '450px', padding: '20px', fontSize: '16px', borderRadius: '8px', border: '2px solid #ccc', boxSizing: 'border-box', cursor: 'pointer' }}
            > 
              <option value="Trainer">Trainer</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
        )}

        <button type="submit" style={{ width: '450px', padding: '20px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <button 
        onClick={() => setIsLogin(!isLogin)} 
        style={{ 
          marginTop: '30px', 
          background: 'none', 
          border: 'none', 
          color: '#ffffff', 
          textDecoration: 'underline', 
          cursor: 'pointer',
          fontSize: '20px',
          fontWeight: '600'
        }}
      > 
        {isLogin 
          ? "Click here to create a new account!" 
          : "Click here to log in!"}
      </button>
    </main>
  );
};

export default LoginPage;