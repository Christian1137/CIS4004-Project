import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Trainer'); 
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
        navigate('/team-build');
      } else {
        setError(data.message || "Access denied. Check your credentials.");
      }
    } catch (err) {
      setError("Unable to connect to the PokéCenter server.");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={welcomeHeaderStyle}>
          <h1 style={titleStyle}>{isLogin ? 'Welcome Back' : 'Register'}</h1>
          <p style={subtitleStyle}>
            {isLogin 
              ? 'Access the Pokémon Team Builder portal.' 
              : 'Create your trainer ID to start drafting.'}
          </p>
        </div>
        
        {error && <div style={errorBoxStyle}>{error}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Trainer ID</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              style={inputStyle}
              placeholder="Username"
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Access Code</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={inputStyle}
              placeholder="Password"
            />
          </div>

          {!isLogin && (
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Role</label>
              <select 
                value={userType} 
                onChange={(e) => setUserType(e.target.value)}
                style={selectStyle}
              >
                <option value="Trainer">Standard Trainer</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>
          )}

          <button type="submit" style={submitButtonStyle}>
            {isLogin ? 'Login' : 'REGISTER TRAINER'}
          </button>
        </form>

        <button 
          onClick={() => {setIsLogin(!isLogin); setError('');}} 
          style={toggleButtonStyle}
        >
          {isLogin ? "New Trainer? Register here" : "Already registered? Log in here"}
        </button>
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  minHeight: '100vh', backgroundColor: '#0f0f12', margin: 0
};

const cardStyle = {
  width: '100%', maxWidth: '400px', padding: '40px',
  backgroundColor: '#1c1c21', borderRadius: '16px',
  boxShadow: '0 10px 40px rgba(0,0,0,0.6)', border: '1px solid #2d2d35',
  textAlign: 'center'
};

const welcomeHeaderStyle = { marginBottom: '30px' };
const titleStyle = { color: '#ffffff', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' };
const subtitleStyle = { color: '#8e8e9a', fontSize: '15px', margin: 0 };

const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroupStyle = { textAlign: 'left' };
const labelStyle = { display: 'block', color: '#b5b5be', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' };

const inputStyle = {
  width: '100%', padding: '12px', borderRadius: '8px',
  border: '1px solid #32323d', backgroundColor: '#25252e',
  color: '#ffffff', fontSize: '16px', boxSizing: 'border-box'
};

const selectStyle = { ...inputStyle, cursor: 'pointer' };

const submitButtonStyle = {
  width: '100%', padding: '14px', marginTop: '10px',
  borderRadius: '8px', border: 'none', backgroundColor: '#cc0000', // Pokedex Red
  color: '#ffffff', fontSize: '16px', fontWeight: 'bold',
  cursor: 'pointer', transition: 'background 0.2s'
};

const errorBoxStyle = {
  color: '#ff6b6b', backgroundColor: 'rgba(255, 107, 107, 0.1)',
  padding: '12px', borderRadius: '8px', marginBottom: '20px',
  fontSize: '14px', border: '1px solid rgba(255, 107, 107, 0.2)'
};

const toggleButtonStyle = {
  background: 'none', border: 'none', color: '#3d8bff',
  marginTop: '25px', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline'
};

export default LoginPage;