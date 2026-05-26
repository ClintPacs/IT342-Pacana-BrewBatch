import React, { useState, useContext, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Sun, Moon, LogOut } from 'lucide-react';
import { AuthContext } from '../../features/auth/AuthContext';
import api from '../services/api';

const pageNames = {
  '/dashboard': 'Dashboard',
  '/inventory': 'Inventory',
  '/orders': 'Orders',
  '/suppliers': 'Suppliers',
  '/alerts': 'Alerts',
  '/admin': 'Admin',
};

export default function Topnav() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [bellOpen, setBellOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef(null);
  const bellRef = useRef(null);

  const pageName = pageNames[location.pathname] || 'BrewBatch';

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get('/api/notifications/me');
        setNotifications(res.data?.data || []);
      } catch {}
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'light' : 'dark');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.username?.[0]?.toUpperCase() || 'U';

  return (
    <header style={{
      height: '52px',
      background: '#4A2008',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Left: breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#D9B896', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
          BrewBatch
        </span>
        <span style={{ color: '#8B5E3C', fontSize: '13px' }}>/</span>
        <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
          {pageName}
        </span>
      </div>

      {/* Right: notifications + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Bell */}
        <div ref={bellRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setBellOpen(!bellOpen)}
            style={{
              background: 'none', border: 'none', color: '#D9B896',
              cursor: 'pointer', position: 'relative', padding: '4px',
            }}
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span style={{
                position: 'absolute', top: '0', right: '0',
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#C0392B', border: '1.5px solid #4A2008',
              }} />
            )}
          </button>
          {bellOpen && (
            <div style={{
              position: 'absolute', right: 0, top: '36px',
              width: '300px', background: '#FFFFFF',
              borderRadius: '12px', boxShadow: '0 8px 32px rgba(59,31,10,0.14)',
              padding: '8px 0', zIndex: 100,
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #F2E4D0', fontSize: '13px', fontWeight: 600, color: '#2E1503' }}>
                Notifications
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: '20px 16px', textAlign: 'center', color: '#8B5E3C', fontSize: '13px' }}>
                  No new notifications
                </div>
              ) : notifications.slice(0, 5).map(n => (
                <div key={n.id} style={{ padding: '10px 16px', borderBottom: '1px solid #F2E4D0', fontSize: '13px', color: '#2E1503' }}>
                  <div style={{ fontWeight: 500 }}>{n.title}</div>
                  <div style={{ color: '#8B5E3C', fontSize: '12px', marginTop: '2px' }}>{n.body}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#6B3A1F', color: '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
              fontSize: '12px', fontWeight: 600, fontFamily: "'Inter', sans-serif",
            }}
          >
            {initials}
          </button>
          {dropdownOpen && (
            <div style={{
              position: 'absolute', right: 0, top: '40px',
              width: '200px', background: '#FFFFFF',
              borderRadius: '12px', boxShadow: '0 8px 32px rgba(59,31,10,0.14)',
              padding: '4px 0', zIndex: 100,
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #F2E4D0' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#2E1503' }}>{user?.fullName || user?.username}</div>
                <div style={{ fontSize: '11px', color: '#8B5E3C' }}>{user?.role}</div>
              </div>
              <button
                onClick={toggleDarkMode}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  width: '100%', padding: '10px 16px', background: 'none',
                  border: 'none', cursor: 'pointer', fontSize: '13px', color: '#2E1503',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF4EC')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                {darkMode ? 'Light mode' : 'Dark mode'}
              </button>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  width: '100%', padding: '10px 16px', background: 'none',
                  border: 'none', cursor: 'pointer', fontSize: '13px', color: '#C0392B',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#FEF2F2')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
