// src/components/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <Link to="/" style={styles.brandLink}>
          ☕ BrewBatch
        </Link>
      </div>
      <div style={styles.links}>
        {isAuthenticated ? (
          <>
            <span style={styles.welcome}>
              Hello, <strong>{user?.username}</strong>
            </span>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 32px',
    backgroundColor: '#3B1F0A',
    color: '#F5E6D3',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  brand: { fontSize: '1.4rem', fontWeight: 'bold' },
  brandLink: { color: '#F5E6D3', textDecoration: 'none' },
  links: { display: 'flex', alignItems: 'center', gap: '16px' },
  welcome: { color: '#D4A574', fontSize: '0.9rem' },
  link: { color: '#F5E6D3', textDecoration: 'none', fontSize: '0.95rem' },
  logoutBtn: {
    padding: '6px 16px',
    backgroundColor: '#C0392B',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  registerBtn: {
    padding: '6px 16px',
    backgroundColor: '#6B4226',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
  },
};

export default Navbar;
