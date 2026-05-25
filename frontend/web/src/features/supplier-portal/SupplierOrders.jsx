import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Truck, PackageCheck, RefreshCw, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import ordersService from '../orders/ordersService';
import api from '../../shared/services/api';
import Modal from '../../shared/components/ui/Modal';
import Button from '../../shared/components/ui/Button';
import Input from '../../shared/components/ui/Input';
import Skeleton from '../../shared/components/ui/Skeleton';

const POLL_MS = 10000;

const STATUS_CONFIG = {
  PENDING:    { color: '#F39C12', bg: '#FFFBEB', label: 'Pending' },
  APPROVED:   { color: '#27AE60', bg: '#F0FDF4', label: 'Approved' },
  REJECTED:   { color: '#C0392B', bg: '#FEF2F2', label: 'Rejected' },
  IN_TRANSIT: { color: '#2980B9', bg: '#EFF6FF', label: 'In Transit' },
  DELIVERED:  { color: '#6B3A1F', bg: '#FAF4EC', label: 'Delivered' },
  CANCELLED:  { color: '#95A5A6', bg: '#F8F9FA', label: 'Cancelled' },
};

const ALL_TABS = ['ALL', 'PENDING', 'APPROVED', 'IN_TRANSIT', 'DELIVERED', 'REJECTED'];

function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}

export default function SupplierOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [actionLoading, setActionLoading] = useState({});
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyForm, setReplyForm] = useState({ subject: '', message: '' });
  const [replying, setReplying] = useState(false);
  const [deliverConfirm, setDeliverConfirm] = useState(null); // order id

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await ordersService.getSupplierOrders();
      setOrders(Array.isArray(res) ? res : []);
    } catch { if (!silent) toast.error('Failed to load orders'); }
    finally { if (!silent) setLoading(false); }
  }, []);

  useEffect(() => {
    load();
    const iv = setInterval(() => load(true), POLL_MS);
    return () => clearInterval(iv);
  }, [load]);

  const doAction = async (id, action, label) => {
    setActionLoading(prev => ({ ...prev, [id]: label }));
    try {
      await action(id);
      toast.success(`Order ${label.toLowerCase()}!`);
      await load(true);
    } catch (err) {
      toast.error(err.response?.data?.error || `Failed to ${label.toLowerCase()} order`);
    } finally {
      setActionLoading(prev => { const n = { ...prev }; delete n[id]; return n; });
    }
  };

  const handleDeliver = async () => {
    if (!deliverConfirm) return;
    await doAction(deliverConfirm, ordersService.deliver, 'Delivered');
    setDeliverConfirm(null);
  };

  const handleReply = async (e) => {
    e.preventDefault();
    setReplying(true);
    try {
      await api.post('/api/notifications/reply', replyForm);
      toast.success('Message sent to admin!');
      setReplyOpen(false);
      setReplyForm({ subject: '', message: '' });
    } catch { toast.error('Failed to send message'); }
    finally { setReplying(false); }
  };

  const filtered = activeTab === 'ALL' ? orders : orders.filter(o => o.status === activeTab);
  const counts = {};
  ALL_TABS.forEach(t => { counts[t] = t === 'ALL' ? orders.length : orders.filter(o => o.status === t).length; });

  const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || { color: '#8B5E3C', bg: '#FAF4EC', label: status };
    return (
      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
        background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33`,
        fontFamily: "'Inter', sans-serif" }}>
        {cfg.label}
      </span>
    );
  };

  const ActionButtons = ({ order }) => {
    const busy = actionLoading[order.id];
    const btnBase = { display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px',
      borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '12px',
      fontWeight: 600, fontFamily: "'Inter', sans-serif", opacity: busy ? 0.6 : 1 };

    if (order.status === 'PENDING') return (
      <div style={{ display: 'flex', gap: '6px' }}>
        <button disabled={!!busy} onClick={() => doAction(order.id, ordersService.approve, 'Approved')}
          style={{ ...btnBase, background: '#27AE60', color: '#FFF' }}>
          <CheckCircle size={13} /> {busy === 'Approved' ? '...' : 'Approve'}
        </button>
        <button disabled={!!busy} onClick={() => doAction(order.id, ordersService.reject, 'Rejected')}
          style={{ ...btnBase, background: 'none', border: '1px solid #C0392B', color: '#C0392B' }}>
          <XCircle size={13} /> {busy === 'Rejected' ? '...' : 'Reject'}
        </button>
      </div>
    );

    if (order.status === 'APPROVED') return (
      <button disabled={!!busy} onClick={() => doAction(order.id, ordersService.transit, 'In Transit')}
        style={{ ...btnBase, background: '#2980B9', color: '#FFF' }}>
        <Truck size={13} /> {busy === 'In Transit' ? '...' : 'Mark In Transit'}
      </button>
    );

    if (order.status === 'IN_TRANSIT') return (
      <button disabled={!!busy} onClick={() => setDeliverConfirm(order.id)}
        style={{ ...btnBase, background: '#6B3A1F', color: '#FFF' }}>
        <PackageCheck size={13} /> Mark as Delivered
      </button>
    );

    return null;
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2E1503', margin: 0 }}>My Orders</h2>
          <p style={{ fontSize: '13px', color: '#8B5E3C', marginTop: '4px', margin: 0 }}>
            {orders.filter(o => o.status === 'PENDING').length > 0
              ? `⚠️ ${orders.filter(o => o.status === 'PENDING').length} pending orders need your attention`
              : 'Orders assigned to your account'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => load(true)} title="Refresh"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B5E3C', padding: '8px', borderRadius: '8px' }}>
            <RefreshCw size={16} />
          </button>
          <button onClick={() => setReplyOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px',
              border: '1.5px solid #6B3A1F', background: 'none', color: '#6B3A1F',
              cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            <MessageSquare size={14} /> Message Admin
          </button>
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        {['PENDING', 'APPROVED', 'IN_TRANSIT', 'DELIVERED'].map(s => {
          const cfg = STATUS_CONFIG[s];
          return (
            <div key={s} onClick={() => setActiveTab(s)} style={{ padding: '12px 14px', borderRadius: '10px',
              background: cfg.bg, border: `1px solid ${cfg.color}33`, cursor: 'pointer',
              transition: 'transform 150ms', textAlign: 'center' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: cfg.color }}>{counts[s]}</div>
              <div style={{ fontSize: '11px', color: '#8B5E3C', marginTop: '2px' }}>{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #F2E4D0', marginBottom: '20px', overflowX: 'auto' }}>
        {ALL_TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '12px', fontWeight: activeTab === t ? 600 : 400,
            color: activeTab === t ? '#6B3A1F' : '#8B5E3C',
            borderBottom: activeTab === t ? '2px solid #6B3A1F' : '2px solid transparent',
            marginBottom: '-2px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px',
          }}>
            {t === 'ALL' ? 'All' : t === 'IN_TRANSIT' ? 'In Transit' : t.charAt(0) + t.slice(1).toLowerCase()}
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 5px', borderRadius: '20px',
              background: activeTab === t ? '#6B3A1F' : '#F2E4D0', color: activeTab === t ? '#FFF' : '#8B5E3C' }}>
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map(i => <Skeleton key={i} height="110px" borderRadius="12px" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>📦</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#2E1503' }}>No {activeTab === 'ALL' ? '' : activeTab.toLowerCase()} orders</div>
          <div style={{ fontSize: '13px', color: '#8B5E3C', marginTop: '6px' }}>Orders assigned to you will appear here.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(order => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
            return (
              <div key={order.id} style={{ borderRadius: '12px', padding: '16px', background: '#FFF',
                border: '1px solid #F2E4D0', borderLeft: `4px solid ${cfg.color}`,
                boxShadow: '0 1px 4px rgba(59,31,10,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: '#6B3A1F' }}>#{order.id}</span>
                      <StatusBadge status={order.status} />
                      <span style={{ fontSize: '11px', color: '#C4874A' }}>{timeAgo(order.createdAt)}</span>
                      {order.inventoryUpdated && (
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '10px',
                          background: '#F0FDF4', color: '#27AE60', fontWeight: 600, border: '1px solid #27AE6033' }}>
                          ✓ Inventory Updated
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#2E1503', marginBottom: '6px' }}>{order.item}</div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#8B5E3C' }}>
                      <span>Qty: <strong style={{ color: '#2E1503' }}>{order.quantity}</strong></span>
                      <span>Total: <strong style={{ color: '#2E1503' }}>₱{(order.totalCost || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</strong></span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <ActionButtons order={order} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delivery Confirmation Modal */}
      <Modal isOpen={!!deliverConfirm} onClose={() => setDeliverConfirm(null)} title="Confirm Delivery" maxWidth="420px">
        <div style={{ fontSize: '14px', color: '#2E1503', marginBottom: '8px', lineHeight: '1.6' }}>
          Mark this order as <strong>Delivered</strong>?
        </div>
        <div style={{ padding: '12px 14px', background: '#FAF4EC', borderRadius: '8px', fontSize: '13px', color: '#8B5E3C', marginBottom: '20px' }}>
          ⚠️ This will automatically update inventory stock. This action cannot be undone.
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={() => setDeliverConfirm(null)}
            style={{ padding: '9px 16px', borderRadius: '8px', border: '1.5px solid #F2E4D0', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#8B5E3C' }}>
            Cancel
          </button>
          <button onClick={handleDeliver}
            style={{ padding: '9px 16px', borderRadius: '8px', border: 'none', background: '#6B3A1F', color: '#FFF', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PackageCheck size={14} /> Confirm Delivery
          </button>
        </div>
      </Modal>

      {/* Message Admin Modal */}
      <Modal isOpen={replyOpen} onClose={() => setReplyOpen(false)} title="Message Admin">
        <form onSubmit={handleReply} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Subject *" value={replyForm.subject}
            onChange={(e) => setReplyForm(f => ({ ...f, subject: e.target.value }))} required />
          <div>
            <div style={{ fontSize: '12px', color: '#8B5E3C', marginBottom: '6px', fontWeight: 500 }}>Message *</div>
            <textarea value={replyForm.message}
              onChange={(e) => setReplyForm(f => ({ ...f, message: e.target.value }))}
              required rows={5}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '6px',
                border: '1.5px solid #F2E4D0', background: '#FAF4EC',
                fontSize: '14px', fontFamily: "'Inter', sans-serif", color: '#2E1503',
                resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#6B3A1F'}
              onBlur={e => e.target.style.borderColor = '#F2E4D0'}
              placeholder="Write your message to the admin..." />
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" type="button" onClick={() => setReplyOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={replying}><Send size={14} /> Send</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
