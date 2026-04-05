import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Trainer'); // either Admin or Trainer

  const { login } = useAuth(); 
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = isLogin 
      ? { username, password } 
      : { username, password, role: userType };

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          login({ username: data.username, role: data.role }); 
          alert(`Welcome back, ${data.username}!`);
        } else {
          // login automatically after register
          login({ username: username, role: userType });
          alert("Account created and logged in!");
        }
        navigate('/team'); 
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
      {/*focus on design later */}
        {isLogin ? "Don't have an account? Register here" : "Do you have an account? Login here"}
      </button>
    </main>
  );
};

export default LoginPage;
