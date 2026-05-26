import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Package, MessageSquare, ShoppingCart, CheckCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import inventoryService from '../inventory/inventoryService';
import api from '../../shared/services/api';
import PageHeader from '../../shared/components/ui/PageHeader';
import Badge from '../../shared/components/ui/Badge';
import Button from '../../shared/components/ui/Button';
import Skeleton from '../../shared/components/ui/Skeleton';

const POLL_MS = 10000;

const typeConfig = {
  ORDER:   { icon: ShoppingCart, color: '#2980B9', bg: '#EFF6FF', label: 'Order' },
  MESSAGE: { icon: MessageSquare, color: '#8E44AD', bg: '#F5EEFB', label: 'Message' },
  STOCK:   { icon: Package, color: '#E67E22', bg: '#FFF8F0', label: 'Stock' },
  DEFAULT: { icon: Bell, color: '#6B3A1F', bg: '#FAF4EC', label: 'Alert' },
};

function timeAgo(isoString) {
  if (!isoString) return '';
  const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(isoString).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}

const TABS = ['All', 'Orders', 'Messages', 'Stock'];

export default function AlertsPage() {
  const [notifications, setNotifications] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [markingAll, setMarkingAll] = useState(false);
  const navigate = useNavigate();

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [notifRes, stockRes] = await Promise.all([
        api.get('/api/notifications/all'),
        inventoryService.getAlerts(),
      ]);
      setNotifications(notifRes.data?.data || []);
      setStockAlerts(Array.isArray(stockRes) ? stockRes : []);
    } catch {}
    finally { if (!silent) setLoading(false); }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(() => load(true), POLL_MS);
    return () => clearInterval(interval);
  }, [load]);

  const markRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch {}
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      await api.put('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
    finally { setMarkingAll(false); }
  };

  // Build combined list: notifications + stock alerts as virtual notifications
  const stockVirtual = stockAlerts.map(item => ({
    id: `stock-${item.id}`, type: 'STOCK', isRead: false,
    title: item.currentStock === 0 ? `Out of Stock: ${item.name}` : `Low Stock: ${item.name}`,
    body: `Current: ${item.currentStock} ${item.unit} | Threshold: ${item.reorderThreshold} ${item.unit}`,
    createdAt: new Date().toISOString(),
    _isStock: true, _item: item,
  }));

  const allItems = [
    ...stockVirtual,
    ...notifications,
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filtered = allItems.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Orders') return n.type === 'ORDER';
    if (activeTab === 'Messages') return n.type === 'MESSAGE';
    if (activeTab === 'Stock') return n.type === 'STOCK';
    return true;
  });

  const unreadCount = allItems.filter(n => !n.isRead).length;

  const counts = {
    All: allItems.length,
    Orders: allItems.filter(n => n.type === 'ORDER').length,
    Messages: allItems.filter(n => n.type === 'MESSAGE').length,
    Stock: stockVirtual.length,
  };

  return (
    <div>
      <PageHeader title="Alerts & Notifications" breadcrumb="BrewBatch / Alerts">
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => load(true)} title="Refresh"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B5E3C', padding: '8px', borderRadius: '8px' }}>
            <RefreshCw size={16} />
          </button>
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" loading={markingAll} onClick={markAllRead}>
              <CheckCircle size={14} /> Mark all read
            </Button>
          )}
        </div>
      </PageHeader>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Unread', value: unreadCount, color: '#C0392B', bg: '#FEF2F2' },
          { label: 'Stock Alerts', value: stockVirtual.length, color: '#E67E22', bg: '#FFF8F0' },
          { label: 'Order Updates', value: counts.Orders, color: '#2980B9', bg: '#EFF6FF' },
          { label: 'Messages', value: counts.Messages, color: '#8E44AD', bg: '#F5EEFB' },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, borderRadius: '10px', padding: '14px 16px', border: `1px solid ${c.color}22` }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: c.color, fontFamily: "'Inter', sans-serif" }}>{c.value}</div>
            <div style={{ fontSize: '12px', color: '#8B5E3C', marginTop: '2px', fontFamily: "'Inter', sans-serif" }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #F2E4D0', marginBottom: '20px' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: activeTab === t ? 600 : 400, fontFamily: "'Inter', sans-serif",
            color: activeTab === t ? '#6B3A1F' : '#8B5E3C',
            borderBottom: activeTab === t ? '2px solid #6B3A1F' : '2px solid transparent',
            marginBottom: '-2px', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            {t}
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '1px 6px', borderRadius: '24px',
              background: activeTab === t ? '#6B3A1F' : '#F2E4D0', color: activeTab === t ? '#FFF' : '#8B5E3C' }}>
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[1, 2, 3, 4].map(i => <Skeleton key={i} height="80px" borderRadius="10px" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#2E1503', fontFamily: "'Inter', sans-serif" }}>All clear!</div>
          <div style={{ fontSize: '13px', color: '#8B5E3C', marginTop: '6px', fontFamily: "'Inter', sans-serif" }}>No {activeTab.toLowerCase()} alerts at this time.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(n => {
            const cfg = typeConfig[n.type] || typeConfig.DEFAULT;
            const Icon = cfg.icon;
            const isStock = n._isStock;
            return (
              <div key={n.id} onClick={() => !isStock && !n.isRead && markRead(n.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                  padding: '14px 16px', borderRadius: '10px',
                  background: n.isRead ? '#FFFFFF' : cfg.bg,
                  border: `1px solid ${n.isRead ? '#F2E4D0' : cfg.color + '33'}`,
                  borderLeft: `4px solid ${n.isRead ? '#F2E4D0' : cfg.color}`,
                  cursor: isStock ? 'default' : 'pointer',
                  transition: 'all 150ms',
                }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: cfg.color + '18', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={16} color={cfg.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: n.isRead ? 500 : 700, color: '#2E1503', fontFamily: "'Inter', sans-serif" }}>
                      {n.title}
                    </span>
                    {!n.isRead && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                    )}
                    <Badge status={n.type === 'ORDER' ? 'PENDING' : n.type === 'MESSAGE' ? 'ACTIVE' : 'LOW STOCK'}>
                      {cfg.label}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '13px', color: '#8B5E3C', fontFamily: "'Inter', sans-serif", lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {n.body}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#C4874A', fontFamily: "'Inter', sans-serif" }}>
                      {timeAgo(n.createdAt)}
                    </span>
                    {isStock && (
                      <Button variant="ghost" size="sm" onClick={() => navigate('/inventory')}>View Inventory</Button>
                    )}
                  </div>
                </div>
                {!isStock && n.isRead && (
                  <CheckCircle size={14} color="#27AE60" style={{ flexShrink: 0, marginTop: '2px' }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}