// src/pages/DashboardPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthService from '../services/authService';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await AuthService.getCurrentUser();
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile. Your session may have expired.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={styles.centered}>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* ── Sidebar ── */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>☕ BrewBatch</div>
        <nav style={styles.sidebarNav}>
          <div style={{ ...styles.navItem, ...styles.navItemActive }}>
            📊 Dashboard
          </div>
          <div style={styles.navItem}>📦 Inventory</div>
          <div style={styles.navItem}>🛒 Orders</div>
          <div style={styles.navItem}>👤 Profile</div>
          <div style={styles.navItem}>⚙️ Settings</div>
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          🚪 Logout
        </button>
      </aside>

      {/* ── Main Content ── */}
      <main style={styles.main}>
        <header style={styles.topBar}>
          <h2 style={styles.pageTitle}>Dashboard</h2>
          <span style={styles.welcomeText}>
            Welcome back, <strong>{user?.username}</strong> 👋
          </span>
        </header>

        {error && <div style={styles.errorBox}>{error}</div>}

        {/* ── Stats Cards ── */}
        <div style={styles.statsGrid}>
          {[
            { icon: '📦', label: 'Inventory Items', value: '42', color: '#6B4226' },
            { icon: '🛒', label: 'Pending Orders', value: '7', color: '#D4A574' },
            { icon: '✅', label: 'Completed Today', value: '23', color: '#27AE60' },
            { icon: '💰', label: "Today's Revenue", value: '₱4,820', color: '#2980B9' },
          ].map((stat) => (
            <div key={stat.label} style={styles.statCard}>
              <span style={styles.statIcon}>{stat.icon}</span>
              <div>
                <div style={{ ...styles.statValue, color: stat.color }}>
                  {stat.value}
                </div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Profile Card ── */}
        {profile && (
          <div style={styles.profileCard}>
            <h3 style={styles.sectionTitle}>👤 My Profile</h3>
            <div style={styles.profileGrid}>
              <ProfileField label="Username" value={profile.username} />
              <ProfileField label="Email" value={profile.email} />
              <ProfileField label="Full Name" value={profile.fullName || '—'} />
              <ProfileField label="Role" value={profile.role} />
              <ProfileField
                label="Member Since"
                value={new Date(profile.createdAt).toLocaleDateString()}
              />
              <ProfileField label="User ID" value={`#${profile.id}`} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div style={styles.profileField}>
    <span style={styles.fieldLabel}>{label}</span>
    <span style={styles.fieldValue}>{value}</span>
  </div>
);

const styles = {
  page: { display: 'flex', minHeight: '100vh', backgroundColor: '#F9F3ED' },
  centered: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' },
  // Sidebar
  sidebar: {
    width: '240px',
    backgroundColor: '#3B1F0A',
    color: '#F5E6D3',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    flexShrink: 0,
  },
  sidebarLogo: {
    fontSize: '1.3rem', fontWeight: 'bold',
    padding: '0 24px 24px', borderBottom: '1px solid #5C3317',
  },
  sidebarNav: { flex: 1, padding: '16px 0' },
  navItem: {
    padding: '12px 24px', cursor: 'pointer', fontSize: '0.95rem',
    color: '#D4A574', transition: 'background 0.2s',
  },
  navItemActive: {
    backgroundColor: '#6B4226', color: '#fff', borderLeft: '3px solid #D4A574',
  },
  logoutBtn: {
    margin: '0 16px 8px',
    padding: '10px 16px',
    backgroundColor: 'transparent',
    color: '#E74C3C',
    border: '1px solid #E74C3C',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  // Main
  main: { flex: 1, padding: '32px', overflow: 'auto' },
  topBar: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '28px',
  },
  pageTitle: { margin: 0, color: '#3B1F0A', fontSize: '1.7rem' },
  welcomeText: { color: '#6B4226', fontSize: '0.95rem' },
  errorBox: {
    backgroundColor: '#FDECEA', color: '#C0392B',
    border: '1px solid #FADBD8', borderRadius: '8px',
    padding: '12px', marginBottom: '16px',
  },
  // Stats
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px', marginBottom: '28px',
  },
  statCard: {
    backgroundColor: '#fff', borderRadius: '12px',
    padding: '20px', display: 'flex', alignItems: 'center',
    gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  },
  statIcon: { fontSize: '2rem' },
  statValue: { fontSize: '1.6rem', fontWeight: 'bold' },
  statLabel: { color: '#8B6E5A', fontSize: '0.85rem', marginTop: '2px' },
  // Profile
  profileCard: {
    backgroundColor: '#fff', borderRadius: '12px',
    padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  },
  sectionTitle: { margin: '0 0 20px', color: '#3B1F0A' },
  profileGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px',
  },
  profileField: {
    display: 'flex', flexDirection: 'column', gap: '4px',
    padding: '12px', backgroundColor: '#F9F3ED', borderRadius: '8px',
  },
  fieldLabel: { fontSize: '0.75rem', color: '#8B6E5A', fontWeight: '600', textTransform: 'uppercase' },
  fieldValue: { fontSize: '0.95rem', color: '#3B1F0A', fontWeight: '500' },
};

export default DashboardPage;
