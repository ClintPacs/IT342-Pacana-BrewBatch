import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, AlertTriangle, ClipboardList, Truck } from 'lucide-react';
import { AuthContext } from '../auth/AuthContext';
import inventoryService from '../inventory/inventoryService';
import ordersService from '../orders/ordersService';
import suppliersService from '../suppliers/suppliersService';
import StatCard from '../../shared/components/ui/StatCard';
import Card from '../../shared/components/ui/Card';
import Badge from '../../shared/components/ui/Badge';
import Table from '../../shared/components/ui/Table';
import Skeleton from '../../shared/components/ui/Skeleton';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const { data: inventoryData, isLoading: invLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => inventoryService.getAll(),
  });

  const { data: alertsData, isLoading: alertLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => inventoryService.getAlerts(),
  });

  const { data: ordersData, isLoading: ordLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersService.getAll(),
  });

  const { data: suppliersData, isLoading: supLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => suppliersService.getAll(),
  });

  const items = Array.isArray(inventoryData) ? inventoryData : [];
  const alerts = Array.isArray(alertsData) ? alertsData : [];
  const orders = Array.isArray(ordersData) ? ordersData : [];
  const suppliers = Array.isArray(suppliersData) ? suppliersData : [];
  const pendingOrders = orders.filter(o => o.status === 'PENDING');

  const orderColumns = [
    { key: 'id', label: 'ID', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>#{r.id}</span> },
    { key: 'supplier', label: 'Supplier' },
    { key: 'item', label: 'Item' },
    { key: 'status', label: 'Status', render: (r) => <Badge status={r.status} /> },
    { key: 'totalCost', label: 'Total', render: (r) => `₱${(r.totalCost || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.02em', color: '#2E1503', fontFamily: "'Inter', sans-serif" }}>
          {greeting()}, {user?.fullName || user?.username} 👋
        </h3>
        <span style={{ fontSize: '13px', color: '#8B5E3C', fontFamily: "'Inter', sans-serif" }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard
          icon={<Package size={20} />}
          value={invLoading ? '...' : items.length}
          label="Total Inventory Items"
        />
        <StatCard
          icon={<AlertTriangle size={20} />}
          value={alertLoading ? '...' : alerts.length}
          label="Low Stock Alerts"
          color={alerts.length > 0 ? '#C0392B' : undefined}
        />
        <StatCard
          icon={<ClipboardList size={20} />}
          value={ordLoading ? '...' : pendingOrders.length}
          label="Open Orders"
        />
        <StatCard
          icon={<Truck size={20} />}
          value={supLoading ? '...' : suppliers.length}
          label="Active Suppliers"
        />
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        {/* Recent Orders */}
        <Card>
          <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#2E1503', marginBottom: '16px', fontFamily: "'Inter', sans-serif" }}>
            Recent Orders
          </h4>
          <Table
            columns={orderColumns}
            data={orders.slice(0, 5)}
            loading={ordLoading}
            emptyTitle="No orders yet"
            emptySubtitle="Create your first purchase order."
            emptyAction="Go to Orders"
            onEmptyAction={() => navigate('/orders')}
          />
        </Card>

        {/* Low Stock */}
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#2E1503', marginBottom: '16px', fontFamily: "'Inter', sans-serif" }}>
            Low Stock Alerts
          </h4>
          {alertLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1,2,3].map(i => <Skeleton key={i} height="72px" borderRadius="12px" />)}
            </div>
          ) : alerts.length === 0 ? (
            <Card>
              <p style={{ color: '#8B5E3C', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                ✅ All items are well-stocked
              </p>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {alerts.slice(0, 5).map(item => (
                <Card key={item.id} hover onClick={() => navigate('/inventory')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#2E1503' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>
                        <span style={{ color: '#C0392B', fontWeight: 600 }}>Current: {item.currentStock} {item.unit}</span>
                        <span style={{ color: '#8B5E3C', marginLeft: '8px' }}>Threshold: {item.reorderThreshold}</span>
                      </div>
                    </div>
                    <Badge status="LOW STOCK" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}