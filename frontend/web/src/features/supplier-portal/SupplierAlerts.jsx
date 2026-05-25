import React, { useState, useEffect, useCallback } from 'react';
import { Bell, ShoppingCart, MessageSquare, CheckCircle, RefreshCw } from 'lucide-react';
import api from '../../shared/services/api';
import Skeleton from '../../shared/components/ui/Skeleton';
import Button from '../../shared/components/ui/Button';

const POLL_MS = 8000;

const TYPE_CONFIG = {
  ORDER:   { icon: ShoppingCart, color: '#2980B9', bg: '#EFF6FF', label: 'Order' },
  MESSAGE: { icon: MessageSquare, color: '#8E44AD', bg: '#F5EEFB', label: 'Message' },
  DEFAULT: { icon: Bell, color: '#6B3A1F', bg: '#FAF4EC', label: 'Alert' },
};

const TABS = ['All', 'Orders', 'Messages'];

function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function SupplierAlerts() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [markingAll, setMarkingAll] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.get('/api/notifications/all');
      setNotifications(res.data?.data || []);
    } catch {}
    finally { if (!silent) setLoading(false); }
  }, []);

  useEffect(() => {
    load();
    const iv = setInterval(() => load(true), POLL_MS);
    return () => clearInterval(iv);
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

  const filtered = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Orders') return n.type === 'ORDER';
    if (activeTab === 'Messages') return n.type === 'MESSAGE';
    return true;
  });

  const unread = notifications.filter(n => !n.isRead).length;
  const counts = {
    All: notifications.length,
    Orders: notifications.filter(n => n.type === 'ORDER').length,
    Messages: notifications.filter(n => n.type === 'MESSAGE').length,
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2E1503', margin: 0 }}>
            Alerts & Messages
            {unread > 0 && (
              <span style={{ marginLeft: '10px', fontSize: '13px', fontWeight: 700, padding: '2px 8px',
                borderRadius: '20px', background: '#C0392B', color: '#FFF' }}>
                {unread} new
              </span>
            )}
          </h2>
          <p style={{ fontSize: '13px', color: '#8B5E3C', marginTop: '4px', margin: 0 }}>
            Messages from admin and order updates
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => load(true)} title="Refresh"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B5E3C', padding: '8px', borderRadius: '8px' }}>
            <RefreshCw size={16} />
          </button>
          {unread > 0 && (
            <Button variant="secondary" size="sm" loading={markingAll} onClick={markAllRead}>
              <CheckCircle size={13} /> Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Unread', value: unread, color: '#C0392B', bg: '#FEF2F2' },
          { label: 'Order Updates', value: counts.Orders, color: '#2980B9', bg: '#EFF6FF' },
          { label: 'Messages', value: counts.Messages, color: '#8E44AD', bg: '#F5EEFB' },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, borderRadius: '10px', padding: '14px 16px',
            border: `1px solid ${c.color}22`, textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: '12px', color: '#8B5E3C', marginTop: '2px' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #F2E4D0', marginBottom: '20px' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: activeTab === t ? 600 : 400,
            color: activeTab === t ? '#6B3A1F' : '#8B5E3C',
            borderBottom: activeTab === t ? '2px solid #6B3A1F' : '2px solid transparent',
            marginBottom: '-2px', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            {t}
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '1px 6px', borderRadius: '20px',
              background: activeTab === t ? '#6B3A1F' : '#F2E4D0', color: activeTab === t ? '#FFF' : '#8B5E3C' }}>
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[1, 2, 3].map(i => <Skeleton key={i} height="88px" borderRadius="10px" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔔</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#2E1503' }}>No notifications yet</div>
          <div style={{ fontSize: '13px', color: '#8B5E3C', marginTop: '6px' }}>
            Order updates and messages from admin will appear here.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(n => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.DEFAULT;
            const Icon = cfg.icon;
            return (
              <div key={n.id}
                onClick={() => !n.isRead && markRead(n.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                  padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
                  background: n.isRead ? '#FFFFFF' : cfg.bg,
                  border: `1px solid ${n.isRead ? '#F2E4D0' : cfg.color + '33'}`,
                  borderLeft: `4px solid ${n.isRead ? '#F2E4D0' : cfg.color}`,
                  transition: 'all 150ms',
                }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%',
                  background: cfg.color + '18', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color={cfg.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: n.isRead ? 500 : 700, color: '#2E1503' }}>
                      {n.title}
                    </span>
                    {!n.isRead && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '20px',
                      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33` }}>
                      {cfg.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#8B5E3C', lineHeight: '1.5',
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {n.body}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#C4874A' }}>{timeAgo(n.createdAt)}</span>
                    {n.isRead && <CheckCircle size={13} color="#27AE60" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
