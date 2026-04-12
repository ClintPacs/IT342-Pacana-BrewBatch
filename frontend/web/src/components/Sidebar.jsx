import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/inventory', icon: '📦', label: 'Inventory' },
  { path: '/alerts',    icon: '⚠️',  label: 'Alerts' },
  { path: '/orders',    icon: '📋', label: 'Orders' },
  { path: '/suppliers', icon: '🏪', label: 'Suppliers' },
  { path: '/admin',     icon: '⚙️',  label: 'Admin' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside style={s.sidebar}>
      <div style={s.logo}>☕ BrewBatch</div>
      <div style={s.section}>NAVIGATION</div>
      {navItems.map(item => (
        <div
          key={item.path}
          style={{
            ...s.item,
            ...(location.pathname === item.path ? s.active : {}),
          }}
          onClick={() => navigate(item.path)}
        >
          {item.icon} {item.label}
        </div>
      ))}
      <button onClick={handleLogout} style={s.logoutBtn}>
        🚪 Logout
      </button>
    </aside>
  );
}

const s = {
  sidebar: {
    width: 200,
    flexShrink: 0,
    background: '#1A0800',
    borderRight: '1px solid rgba(180,100,40,.15)',
    padding: '16px 0',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 52px)',
  },
  logo: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: 700,
    color: '#fff',
    padding: '0 16px 16px',
    borderBottom: '1px solid rgba(180,100,40,.15)',
    marginBottom: 8,
  },
  section: {
    padding: '6px 14px 3px',
    fontSize: 9,
    letterSpacing: 2,
    color: 'rgba(180,100,40,.4)',
    fontFamily: 'monospace',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    fontSize: 13,
    color: 'rgba(212,152,100,.5)',
    cursor: 'pointer',
    borderLeft: '2px solid transparent',
    transition: 'all .15s',
  },
  active: {
    color: '#C4874A',
    borderLeftColor: '#C4874A',
    background: 'rgba(180,100,40,.12)',
  },
  logoutBtn: {
    margin: '16px',
    padding: '8px',
    background: 'transparent',
    color: '#E74C3C',
    border: '1px solid #E74C3C',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13,
  },
};