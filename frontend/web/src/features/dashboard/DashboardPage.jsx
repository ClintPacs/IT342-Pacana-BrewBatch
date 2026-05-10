import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import AuthService from '../auth/authService';
import InventoryService from '../inventory/inventoryService';
import Sidebar from '../../shared/components/Sidebar';

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ total: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    async function load() {
      try {
        const [prof, items, alerts] = await Promise.all([
          AuthService.getCurrentUser(),
          InventoryService.getAll(),
          InventoryService.getAlerts(),
        ]);
        setProfile(prof);
        setStats({ total: items.length, lowStock: alerts.length });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={s.layout}>
      {/* Top Nav */}
      <nav style={s.topnav}>
        <div style={s.navLogo}>☕ BrewBatch</div>
        <span style={s.navUser}>
          Welcome, <strong>{user?.username || profile?.username}</strong>
        </span>
      </nav>

      <div style={s.body}>
        <Sidebar />
        <main style={s.main}>
          <h2 style={s.title}>Dashboard</h2>

          {/* Stat Cards */}
          <div style={s.grid}>
            <StatCard icon="📦" label="Total Items" value={stats.total} color="#6B3A1F" />
            <StatCard icon="⚠️" label="Low Stock" value={stats.lowStock} color="#C0392B" />
            <StatCard icon="✅" label="Status" value="Active" color="#27AE60" />
          </div>

          {/* Profile Card */}
          {loading ? (
            <p style={{ color: '#8B5E3C' }}>Loading profile...</p>
          ) : profile && (
            <div style={s.card}>
              <div style={s.cardHead}>👤 My Profile</div>
              {[
                ['Username', profile.username],
                ['Full Name', profile.fullName || '—'],
                ['Email', profile.email],
                ['Role', profile.role],
                ['ID', `#${profile.id}`],
              ].map(([k, v]) => (
                <div key={k} style={s.row}>
                  <span style={s.key}>{k}</span>
                  <span style={s.val}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={s.statCard}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
        <div style={{ fontSize: 11, color: '#8B5E3C', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

const s = {
  layout: { minHeight: '100vh', background: '#FAF4EC', display: 'flex', flexDirection: 'column' },
  topnav: { background: '#4A2008', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navLogo: { fontFamily: 'serif', fontSize: 16, fontWeight: 700, color: '#fff' },
  navUser: { color: '#D9B896', fontSize: 13 },
  body: { display: 'flex', flex: 1 },
  main: { flex: 1, padding: 24 },
  title: { fontFamily: 'serif', fontSize: 22, color: '#2E1503', marginBottom: 20 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 },
  statCard: { background: '#fff', borderRadius: 10, padding: 16, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 8px rgba(106,58,31,.07)' },
  card: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(106,58,31,.08)', maxWidth: 500 },
  cardHead: { background: '#F2E4D0', padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#6B3A1F' },
  row: { display: 'flex', alignItems: 'center', padding: '9px 16px', borderBottom: '1px solid #F5F0E8' },
  key: { width: 100, fontSize: 10, color: '#8B5E3C', textTransform: 'uppercase', fontWeight: 500 },
  val: { fontSize: 13, fontWeight: 500, color: '#2E1503' },
};