import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import "../styles/Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'agent'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await API.post('/auth/register', formData);

      setSuccess("✅ Signup successful! Redirecting to login...");

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed.');
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="signup-page">
      <div className="signup-left">
        <div className="signup-box">
          <h2 className="signup-heading">Create an Account</h2>
          <p className="signup-subheading">Join as Agent or Customer</p>

          <form onSubmit={handleSignup} className="signup-form">
            <div className="input-group">
              <span>👤</span>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <span>📧</span>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group password-input-group">
              <span>🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <span
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </div>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="role-select"
            >
              <option value="agent" className="role-option" >Agent</option>
              <option value="customer" className="role-option">Customer</option>
            </select>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <button type="submit" className="signup-submit">Sign Up</button>

            <button type="button" className="login-link" onClick={goToLogin}>
              Already have an account? Login
            </button>
          </form>
        </div>
      </div>

      <div className="signup-right"></div>
    </div>
  );
};

export default Signup;
