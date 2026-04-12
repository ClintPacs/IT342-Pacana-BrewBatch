// OrdersPage.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function OrdersPage() {
  const { user } = useAuth();
  return (
    <div style={{ minHeight: '100vh', background: '#FAF4EC', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ background: '#4A2008', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'serif', fontSize: 16, fontWeight: 700, color: '#fff' }}>☕ BrewBatch</div>
        <span style={{ color: '#D9B896', fontSize: 13 }}>Welcome, <strong>{user?.username}</strong></span>
      </nav>
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 24 }}>
          <h2 style={{ fontFamily: 'serif', fontSize: 22, color: '#2E1503', marginBottom: 20 }}>Purchase Orders</h2>
          <div style={{ background: '#fff', borderRadius: 12, padding: 40, textAlign: 'center', color: '#8B5E3C', boxShadow: '0 2px 8px rgba(106,58,31,.07)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 16, fontFamily: 'serif', color: '#2E1503', marginBottom: 8 }}>Purchase Orders</div>
            <div style={{ fontSize: 13 }}>Coming soon — Phase 3</div>
          </div>
        </main>
      </div>
    </div>
  );
}