import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, ClipboardList, Truck, AlertTriangle,
  Users, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import { AuthContext } from '../../features/auth/AuthContext';
import inventoryService from '../../features/inventory/inventoryService';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/inventory', label: 'Inventory', icon: Package },
  { path: '/orders', label: 'Orders', icon: ClipboardList },
  { path: '/suppliers', label: 'Suppliers', icon: Truck },
  { path: '/alerts', label: 'Alerts', icon: AlertTriangle, badge: true },
  { path: '/admin', label: 'Admin', icon: Users, adminOnly: true },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await inventoryService.getAlerts();
        setAlertCount(res?.data?.length || 0);
      } catch {}
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarStyle = {
    width: collapsed ? '64px' : '200px',
    minHeight: '100vh',
    background: '#1A0800',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 200ms cubic-bezier(0.4,0,0.2,1)',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    overflow: 'hidden',
  };

  const linkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: collapsed ? '10px 20px' : '10px 16px',
    margin: '2px 8px',
    borderRadius: '8px',
    color: isActive ? '#FFFFFF' : '#D9B896',
    background: isActive ? 'rgba(196,135,74,0.15)' : 'transparent',
    borderLeft: isActive ? '3px solid #C4874A' : '3px solid transparent',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: isActive ? 600 : 400,
    fontFamily: "'Inter', sans-serif",
    transition: 'background 150ms, color 150ms, border-color 150ms',
    whiteSpace: 'nowrap',
    position: 'relative',
  });

  return (
    <motion.aside style={sidebarStyle} animate={{ width: collapsed ? 64 : 200 }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '20px 12px' : '20px 16px', borderBottom: '1px solid rgba(196,135,74,0.15)' }}>
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 700,
          fontSize: collapsed ? '16px' : '20px',
          color: '#FFFFFF',
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}>
          {collapsed ? 'BB' : '☕ BrewBatch'}
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: '12px' }}>
        {navItems
          .filter(item => !item.adminOnly || user?.role === 'ADMIN')
          .map(({ path, label, icon: Icon, badge }) => (
            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => linkStyle(isActive)}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
              {badge && alertCount > 0 && (
                <span style={{
                  position: collapsed ? 'absolute' : 'relative',
                  top: collapsed ? '4px' : 'auto',
                  right: collapsed ? '8px' : 'auto',
                  marginLeft: collapsed ? 0 : 'auto',
                  background: '#C0392B',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: '24px',
                  minWidth: '18px',
                  textAlign: 'center',
                }}>
                  {alertCount}
                </span>
              )}
            </NavLink>
          ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(196,135,74,0.15)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            width: '100%',
            background: 'none',
            border: '1px solid rgba(192,57,43,0.3)',
            borderRadius: '8px',
            color: '#C0392B',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: "'Inter', sans-serif",
            transition: 'background 150ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(192,57,43,0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
        >
          <LogOut size={16} />
          {!collapsed && 'Logout'}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '8px',
            marginTop: '8px',
            background: 'none',
            border: 'none',
            color: '#D9B896',
            cursor: 'pointer',
            borderRadius: '6px',
            transition: 'background 150ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(196,135,74,0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </motion.aside>
  );
}