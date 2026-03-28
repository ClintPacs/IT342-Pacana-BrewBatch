// src/pages/LoginPage.js

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.username, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        'Invalid username or password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.logo}>☕</h1>
          <h2 style={styles.title}>Welcome to BrewBatch</h2>
          <p style={styles.subtitle}>Sign in to manage your coffee shop</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5E6D3',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 8px 32px rgba(59,31,10,0.12)',
  },
  header: { textAlign: 'center', marginBottom: '28px' },
  logo: { fontSize: '3rem', marginBottom: '8px' },
  title: { margin: 0, color: '#3B1F0A', fontSize: '1.6rem' },
  subtitle: { color: '#8B6E5A', marginTop: '6px', fontSize: '0.9rem' },
  errorBox: {
    backgroundColor: '#FDECEA',
    color: '#C0392B',
    border: '1px solid #FADBD8',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
    fontSize: '0.9rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#3B1F0A', fontWeight: '600', fontSize: '0.9rem' },
  input: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1.5px solid #D4A574',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '13px',
    backgroundColor: '#6B4226',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '6px',
    transition: 'background-color 0.2s',
  },
  footer: { textAlign: 'center', marginTop: '20px', color: '#8B6E5A', fontSize: '0.9rem' },
  link: { color: '#6B4226', fontWeight: '600', textDecoration: 'none' },
};

export default LoginPage;
