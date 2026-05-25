import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InventoryService from '../inventory/inventoryService';
import Sidebar from '../../shared/components/Sidebar';
import { useAuth } from '../auth/AuthContext';

export default function AlertsPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const data = await InventoryService.getAlerts();
      setAlerts(data);
    } catch { } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  return (
    <div style={s.layout}>
      <nav style={s.topnav}>
        <div style={s.navLogo}>☕ BrewBatch</div>
        <span style={s.navUser}>Welcome, <strong>{user?.username}</strong></span>
      </nav>
      <div style={s.body}>
        <Sidebar />
        <main style={s.main}>
          <h2 style={s.title}>Low Stock Alerts</h2>

          {alerts.length > 0 && (
            <div style={s.warningBanner}>
              ⚠️ {alerts.length} item{alerts.length > 1 ? 's' : ''} below reorder threshold
            </div>
          )}

          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  {['Item Name', 'Current Stock', 'Threshold', 'Unit', 'Action'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={s.empty}>Loading alerts...</td></tr>
                ) : alerts.length === 0 ? (
                  <tr><td colSpan={5} style={s.empty}>✅ All items are sufficiently stocked!</td></tr>
                ) : alerts.map(item => (
                  <tr key={item.id} style={s.tr}>
                    <td style={s.td}><strong>{item.name}</strong></td>
                    <td style={{ ...s.td, color: '#C0392B', fontWeight: 700 }}>{item.currentStock}</td>
                    <td style={s.td}>{item.reorderThreshold}</td>
                    <td style={s.td}>{item.unit}</td>
                    <td style={s.td}>
                      <button
                        style={s.orderBtn}
                        onClick={() => navigate('/orders')}
                      >
                        Create Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
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
  warningBanner: { background: '#FEF2F2', border: '1px solid #FECACA', color: '#C0392B', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13 },
  tableWrap: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(106,58,31,.07)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#F2E4D0' },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B3A1F', textTransform: 'uppercase', letterSpacing: 0.5 },
  tr: { borderBottom: '1px solid #F5F0E8' },
  td: { padding: '10px 14px', fontSize: 13, color: '#2E1503' },
  empty: { padding: 32, textAlign: 'center', color: '#8B5E3C', fontSize: 13 },
  orderBtn: { padding: '5px 12px', background: '#6B3A1F', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 },
};