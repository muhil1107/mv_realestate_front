import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post('/auth/login', { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'agent') navigate('/agent/dashboard');
      else if (role === 'customer') navigate('/customer/dashboard');
      else setError('Unknown role');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-box">
          <h2 className="login-heading">Welcome Back</h2>
          <p className="login-subheading">Let’s login to grab amazing deals</p>

          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="show-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="login-submit">Login</button>

            <p className="signup-link">
              Don’t have an account? <span onClick={goToSignup}>Sign Up</span>
            </p>
          </form>
        </div>
      </div>

      <div className="login-right">
        <div className="image-overlay">
          <p className="image-caption">
            Browse thousands of properties to buy, sell,<br />
            and rent with trusted agents.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
