import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ClipboardList, FileText, UserCircle, LogOut, Bell } from 'lucide-react';
import { AuthContext } from '../auth/AuthContext';

const navItems = [
  { path: '/supplier/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/supplier/orders', label: 'Orders', icon: ClipboardList },
  { path: '/supplier/alerts', label: 'Alerts', icon: Bell },
  { path: '/supplier/invoices', label: 'Invoices', icon: FileText },
  { path: '/supplier/profile', label: 'Profile', icon: UserCircle },
];

export default function SupplierLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'S';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px', background: '#1A0800', display: 'flex', flexDirection: 'column',
        position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(196,135,74,0.15)' }}>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '18px', color: '#FFFFFF' }}>
            ☕ Supplier Portal
          </span>
        </div>

        {/* Profile chip */}
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(196,135,74,0.15)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%', background: '#6B3A1F',
            color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 600,
          }}>{initials}</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#FFFFFF' }}>{user?.fullName || user?.username}</div>
            <div style={{ fontSize: '11px', color: '#D9B896' }}>Supplier</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, paddingTop: '12px' }}>
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 16px', margin: '2px 8px', borderRadius: '8px',
                color: isActive ? '#FFFFFF' : '#D9B896',
                background: isActive ? 'rgba(196,135,74,0.15)' : 'transparent',
                borderLeft: isActive ? '3px solid #C4874A' : '3px solid transparent',
                textDecoration: 'none', fontSize: '13px', fontWeight: isActive ? 600 : 400,
                fontFamily: "'Inter', sans-serif", transition: 'all 150ms',
              })}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(196,135,74,0.15)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 16px', width: '100%', background: 'none',
              border: '1px solid rgba(192,57,43,0.3)', borderRadius: '8px',
              color: '#C0392B', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: '220px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top bar */}
        <header style={{
          height: '52px', background: '#4A2008', display: 'flex', alignItems: 'center',
          padding: '0 24px', position: 'sticky', top: 0, zIndex: 50,
        }}>
          <span style={{ color: '#D9B896', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>Supplier Portal</span>
          <span style={{ color: '#8B5E3C', fontSize: '13px', margin: '0 8px' }}>/</span>
          <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
            {navItems.find(n => location.pathname.startsWith(n.path))?.label || 'Dashboard'}
          </span>
        </header>

        <main style={{ flex: 1, padding: '24px 32px', background: 'var(--bg-page, #FAF4EC)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
