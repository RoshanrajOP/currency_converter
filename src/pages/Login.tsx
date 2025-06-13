import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import '../Login.css'; 

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
    <div className="login-left">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Welcome Back</h2>
        <p className="subtitle">Please login to your account</p>
  
        <label>Email</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your email"
          required
        />
  
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
  
        <div className="form-footer">
          <label className='remember-label'>
            <input type="checkbox" />
            Remember me
          </label>
          <a href="#" className="forgot-password">Forgot password?</a>
        </div>
  
        {error && <p style={{ color: 'red', fontSize: '0.875rem' }}>{error}</p>}
  
        <button type="submit" className="login-button">Sign In</button>
  
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Don’t have an account? <a href="#" className="forgot-password">Sign Up</a>
        </p>
      </form>
    </div>
  
    <div className="login-right">
    <img src="/12085707_20944201.svg" alt="Login illustration" />

    </div>
  </div>
  
  );
}
