import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from './authService';
import Button from '../../shared/components/ui/Button';
import Input from '../../shared/components/ui/Input';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', fullName: '', email: '', password: '', confirmPassword: '', role: 'BARISTA',
    companyName: '', contactName: '', phone: '', address: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const isSupplier = form.role === 'SUPPLIER';

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score += 30;
    if (p.length >= 12) score += 20;
    if (/[A-Z]/.test(p)) score += 15;
    if (/[0-9]/.test(p)) score += 15;
    if (/[^A-Za-z0-9]/.test(p)) score += 20;
    return Math.min(score, 100);
  };

  const strength = passwordStrength();
  const strengthColor = strength < 40 ? '#C0392B' : strength < 70 ? '#F39C12' : '#27AE60';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      // For suppliers, auto-fill fullName from contactName if empty
      const payload = { ...form };
      if (isSupplier && !payload.fullName) {
        payload.fullName = payload.contactName || payload.companyName;
      }
      await authService.register(payload);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#FAF4EC',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        background: '#FFFFFF', borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(59,31,10,0.14)',
        padding: '40px 36px', width: '100%', maxWidth: isSupplier ? '520px' : '420px',
        transition: 'max-width 300ms',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '28px', fontWeight: 700, color: '#2E1503',
          }}>
            ☕ BrewBatch
          </span>
          <p style={{ color: '#8B5E3C', fontSize: '14px', marginTop: '8px' }}>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Role selector first */}
          <div>
            <div style={{ fontSize: '12px', color: '#8B5E3C', marginBottom: '6px', fontWeight: 500 }}>I am a</div>
            <div style={{ display: 'flex', gap: '0', borderRadius: '8px', overflow: 'hidden', border: '1.5px solid #6B3A1F' }}>
              {['BARISTA', 'SUPPLIER'].map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm({ ...form, role })}
                  style={{
                    flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
                    background: form.role === role ? '#6B3A1F' : '#FFFFFF',
                    color: form.role === role ? '#FFFFFF' : '#6B3A1F',
                    fontWeight: 600, fontSize: '12px', fontFamily: "'Inter', sans-serif",
                    transition: 'background 150ms, color 150ms',
                  }}
                >
                  {role === 'BARISTA' ? '☕ Staff' : '🏭 Supplier'}
                </button>
              ))}
            </div>
          </div>

          {/* Supplier-specific fields */}
          {isSupplier && (
            <div style={{
              background: '#FAF4EC', borderRadius: '10px', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '12px',
              border: '1px solid #F2E4D0',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B3A1F', marginBottom: '4px' }}>
                🏭 Company Information
              </div>
              <Input label="Company Name *" value={form.companyName} onChange={set('companyName')} required />
              <Input label="Contact Name *" value={form.contactName} onChange={set('contactName')} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input label="Phone" value={form.phone} onChange={set('phone')} />
                <Input label="Address" value={form.address} onChange={set('address')} />
              </div>
            </div>
          )}

          {/* Common fields */}
          <Input label="Username" value={form.username} onChange={set('username')} required />
          <Input label="Full Name" value={form.fullName} onChange={set('fullName')} required />
          <Input label="Email" type="email" value={form.email} onChange={set('email')} required />

          <div>
            <Input label="Password" type="password" value={form.password} onChange={set('password')} required />
            {form.password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ height: '4px', borderRadius: '2px', background: '#F2E4D0', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${strength}%`, background: strengthColor, transition: 'width 200ms, background 200ms', borderRadius: '2px' }} />
                </div>
                <span style={{ fontSize: '11px', color: strengthColor, marginTop: '4px', display: 'block' }}>
                  {strength < 40 ? 'Weak' : strength < 70 ? 'Fair' : 'Strong'}
                </span>
              </div>
            )}
          </div>

          <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} required
            error={form.confirmPassword && form.password !== form.confirmPassword ? 'Passwords do not match' : ''} />

          <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%', marginTop: '8px' }}>
            {isSupplier ? 'Register as Supplier' : 'Create Account'}
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#8B5E3C' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6B3A1F', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
