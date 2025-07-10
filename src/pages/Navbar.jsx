import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const currentPath = location.pathname;

  return (
    <nav className="navbar">
      <div className="navbar-left">
          <Link to="/" className="logo">
            <img src="../assets/real-estate-logo.png" alt="logo" id='logo-c' /> MV Real Estate
          </Link>
      </div>

      <div className="navbar-right">
        {!user ? (
          <>
            {currentPath !== '/login' && (
              <Link to="/login" className="nav-btn login-btn">Login</Link>
            )}
            {currentPath !== '/signup' && (
              <Link to="/signup" className="nav-btn signup-btn">Signup</Link>
            )}
            {currentPath !== '/' && (
              <Link to="/" className="nav-btn home-btn">Home</Link>
            )}
            {currentPath !== '/contact' && (
              <Link to="/contact" className="nav-btn contact-btn">Contact</Link>
            )}
          </>
        ) : (
          <button className="nav-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
