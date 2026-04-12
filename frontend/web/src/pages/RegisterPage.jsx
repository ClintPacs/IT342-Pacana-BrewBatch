// src/pages/RegisterPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await register(
        formData.username,
        formData.email,
        formData.password,
        formData.fullName
      );
      setSuccess(response.message || 'Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Registration failed. Please try again.';
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
          <h2 style={styles.title}>Create an Account</h2>
          <p style={styles.subtitle}>Join BrewBatch and start managing your shop</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="janedoe"
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                required
                style={styles.input}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in here</Link>
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
    maxWidth: '520px',
    boxShadow: '0 8px 32px rgba(59,31,10,0.12)',
  },
  header: { textAlign: 'center', marginBottom: '28px' },
  logo: { fontSize: '3rem' },
  title: { margin: 0, color: '#3B1F0A', fontSize: '1.6rem' },
  subtitle: { color: '#8B6E5A', marginTop: '6px', fontSize: '0.9rem' },
  errorBox: {
    backgroundColor: '#FDECEA', color: '#C0392B',
    border: '1px solid #FADBD8', borderRadius: '8px',
    padding: '12px', marginBottom: '16px', fontSize: '0.9rem',
  },
  successBox: {
    backgroundColor: '#EAFAF1', color: '#1E8449',
    border: '1px solid #A9DFBF', borderRadius: '8px',
    padding: '12px', marginBottom: '16px', fontSize: '0.9rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#3B1F0A', fontWeight: '600', fontSize: '0.85rem' },
  input: {
    padding: '11px 13px', borderRadius: '8px',
    border: '1.5px solid #D4A574', fontSize: '0.95rem', outline: 'none',
  },
  button: {
    padding: '13px', backgroundColor: '#6B4226', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '1rem',
    fontWeight: '600', cursor: 'pointer', marginTop: '6px',
  },
  footer: { textAlign: 'center', marginTop: '20px', color: '#8B6E5A', fontSize: '0.9rem' },
  link: { color: '#6B4226', fontWeight: '600', textDecoration: 'none' },
};

export default RegisterPage;
