import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { AuthContext } from './AuthContext';
import Button from '../../shared/components/ui/Button';
import Input from '../../shared/components/ui/Input';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(username, password);
      toast.success('Welcome back!');
      // Redirect suppliers to their portal
      const userRole = user?.role || '';
      if (userRole === 'SUPPLIER') {
        navigate('/supplier/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAF4EC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', sans-serif",
    }}>
      <motion.div
        animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(59,31,10,0.14)',
          padding: '40px 36px',
          width: '100%',
          maxWidth: '420px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '28px',
            fontWeight: 700,
            color: '#2E1503',
            letterSpacing: '-0.02em',
          }}>
            ☕ BrewBatch
          </span>
          <p style={{ color: '#8B5E3C', fontSize: '14px', marginTop: '8px' }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            endIcon={
              showPassword
                ? <EyeOff size={16} onClick={() => setShowPassword(false)} />
                : <Eye size={16} onClick={() => setShowPassword(true)} />
            }
          />
          <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%', marginTop: '8px' }}>
            Sign In
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#8B5E3C' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#6B3A1F', fontWeight: 600, textDecoration: 'none' }}>
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
