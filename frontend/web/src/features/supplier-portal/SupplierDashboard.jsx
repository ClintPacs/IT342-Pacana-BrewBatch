import React, { useContext, useState, useEffect } from 'react';
import { ClipboardList, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { AuthContext } from '../auth/AuthContext';
import supplierPortalService from './supplierPortalService';
import StatCard from '../../shared/components/ui/StatCard';
import Card from '../../shared/components/ui/Card';
import Badge from '../../shared/components/ui/Badge';
import Skeleton from '../../shared/components/ui/Skeleton';

export default function SupplierDashboard() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [o, i] = await Promise.all([
          supplierPortalService.getMyOrders(),
          supplierPortalService.getMyInvoices(),
        ]);
        setOrders(o || []);
        setInvoices(i || []);
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  const pending = orders.filter(o => o.status === 'PENDING');
  const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + (i.amount || 0), 0);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#2E1503', fontFamily: "'Inter', sans-serif" }}>
          {greeting()}, {user?.fullName || user?.username} 👋
        </h3>
        <p style={{ fontSize: '13px', color: '#8B5E3C', marginTop: '4px', fontFamily: "'Inter', sans-serif" }}>
          Here's your supplier overview
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard icon={<ClipboardList size={20} />} value={loading ? '...' : orders.length} label="Total Orders" />
        <StatCard icon={<AlertTriangle size={20} />} value={loading ? '...' : pending.length} label="Pending Orders" color={pending.length > 0 ? '#F39C12' : undefined} />
        <StatCard icon={<FileText size={20} />} value={loading ? '...' : invoices.length} label="Total Invoices" />
        <StatCard icon={<TrendingUp size={20} />} value={loading ? '...' : `₱${totalRevenue.toLocaleString()}`} label="Revenue (Paid)" />
      </div>

      {/* Recent Orders */}
      <Card style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#2E1503', marginBottom: '16px', fontFamily: "'Inter', sans-serif" }}>
          Recent Orders
        </h4>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[1,2,3].map(i => <Skeleton key={i} height="48px" />)}
          </div>
        ) : orders.length === 0 ? (
          <p style={{ color: '#8B5E3C', fontSize: '13px', textAlign: 'center', padding: '20px' }}>No orders assigned to you yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {orders.slice(0, 5).map(o => (
              <div key={o.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', borderRadius: '8px', background: '#FAF4EC',
              }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#2E1503' }}>{o.item}</span>
                  <span style={{ fontSize: '12px', color: '#8B5E3C', marginLeft: '8px' }}>Qty: {o.quantity}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>₱{(o.totalCost || 0).toLocaleString()}</span>
                  <Badge status={o.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
