import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Trash2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import ordersService from './ordersService';
import suppliersService from '../suppliers/suppliersService';
import PageHeader from '../../shared/components/ui/PageHeader';
import Table from '../../shared/components/ui/Table';
import Badge from '../../shared/components/ui/Badge';
import Button from '../../shared/components/ui/Button';
import Modal from '../../shared/components/ui/Modal';
import Input from '../../shared/components/ui/Input';

const statuses = ['ALL', 'PENDING', 'APPROVED', 'RECEIVED', 'CANCELLED'];
const POLL_MS = 15000;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [form, setForm] = useState({ supplier: '', supplierEmail: '', item: '', quantity: '', totalCost: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [oRes, sRes] = await Promise.all([
        ordersService.getAll(),
        suppliersService.getAll(),
      ]);
      setOrders(Array.isArray(oRes) ? oRes : []);
      setSuppliers(Array.isArray(sRes) ? sRes : []);
    } catch { if (!silent) toast.error('Failed to load orders'); }
    finally { if (!silent) setLoading(false); }
  }, []);

  // Initial load + polling every 15s
  useEffect(() => {
    load();
    const interval = setInterval(() => load(true), POLL_MS);
    return () => clearInterval(interval);
  }, [load]);

  const filtered = activeTab === 'ALL' ? orders : orders.filter(o => o.status === activeTab);
  const counts = {};
  statuses.forEach(s => { counts[s] = s === 'ALL' ? orders.length : orders.filter(o => o.status === s).length; });

  const openAdd = () => {
    setForm({ supplier: '', supplierEmail: '', item: '', quantity: '', totalCost: '' });
    setStep(1);
    setModalOpen(true);
  };

  const selectSupplier = (s) => {
    setForm(f => ({ ...f, supplier: s.name, supplierEmail: s.email }));
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await ordersService.create({
        supplier: form.supplier,
        supplierEmail: form.supplierEmail,
        item: form.item,
        quantity: parseInt(form.quantity),
        totalCost: parseFloat(form.totalCost),
      });
      toast.success('Order placed!');
      setModalOpen(false);
      await load(true); // silent refresh
    } catch { toast.error('Failed to place order'); }
    finally { setSaving(false); }
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === 'cancel') {
        await ordersService.cancel(confirmAction.id);
        toast.success('Order cancelled');
      } else {
        await ordersService.delete(confirmAction.id);
        toast.success('Order deleted');
      }
      setConfirmOpen(false);
      await load(true);
    } catch { toast.error('Action failed'); }
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const columns = [
    { key: 'id', label: 'Order ID', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 600 }}>#{r.id}</span> },
    { key: 'supplier', label: 'Supplier' },
    { key: 'item', label: 'Item' },
    { key: 'quantity', label: 'Qty' },
    { key: 'totalCost', label: 'Total', render: (r) => '₱' + (r.totalCost || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) },
    { key: 'status', label: 'Status', render: (r) => <Badge status={r.status} /> },
    { key: 'createdAt', label: 'Date', render: (r) => <span style={{ fontSize: '12px', color: '#8B5E3C' }}>{formatDate(r.createdAt)}</span> },
    {
      key: 'actions', label: '', sortable: false, render: (r) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          {r.status !== 'CANCELLED' && r.status !== 'RECEIVED' && (
            <button onClick={() => { setConfirmAction({ type: 'cancel', id: r.id }); setConfirmOpen(true); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F39C12', padding: '6px', borderRadius: '6px' }} title="Cancel">
              <X size={14} />
            </button>
          )}
          {(r.status === 'CANCELLED') && (
            <button onClick={() => { setConfirmAction({ type: 'delete', id: r.id }); setConfirmOpen(true); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C0392B', padding: '6px', borderRadius: '6px' }} title="Delete">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )
    },
  ];

  return (
    <div>
      <PageHeader title="Orders" breadcrumb="BrewBatch / Orders">
        <button onClick={() => load(true)} title="Refresh"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B5E3C', padding: '8px', borderRadius: '8px', marginRight: '8px' }}>
          <RefreshCw size={16} />
        </button>
        <Button variant="primary" size="md" onClick={openAdd}><Plus size={16} /> New Order</Button>
      </PageHeader>

      {/* Status tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #F2E4D0', marginBottom: '20px' }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setActiveTab(s)} style={{
            padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: activeTab === s ? 600 : 400, fontFamily: "'Inter', sans-serif",
            color: activeTab === s ? '#6B3A1F' : '#8B5E3C',
            borderBottom: activeTab === s ? '2px solid #6B3A1F' : '2px solid transparent',
            marginBottom: '-2px', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '1px 6px', borderRadius: '24px',
              background: activeTab === s ? '#6B3A1F' : '#F2E4D0', color: activeTab === s ? '#FFF' : '#8B5E3C' }}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      <Table columns={columns} data={filtered} loading={loading} emptyTitle="No orders" emptySubtitle="Place a purchase order to get started." emptyAction="New Order" onEmptyAction={openAdd} />

      {/* New Order Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Order">
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: '4px', borderRadius: '2px', background: step >= s ? '#6B3A1F' : '#F2E4D0' }} />
          ))}
        </div>

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '13px', color: '#8B5E3C', marginBottom: '4px', fontFamily: "'Inter', sans-serif" }}>Select a supplier:</div>
            {suppliers.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#8B5E3C', fontSize: '13px', background: '#FAF4EC', borderRadius: '8px' }}>
                No suppliers registered yet.
              </div>
            ) : (
              suppliers.map(s => (
                <button key={s.id} onClick={() => { selectSupplier(s); setStep(2); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
                    border: form.supplier === s.name ? '2px solid #6B3A1F' : '1.5px solid #F2E4D0',
                    background: form.supplier === s.name ? '#FAF4EC' : '#FFFFFF',
                    textAlign: 'left', width: '100%',
                  }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#6B3A1F', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>
                    {s.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#2E1503', fontFamily: "'Inter', sans-serif" }}>{s.name}</div>
                    <div style={{ fontSize: '12px', color: '#8B5E3C' }}>{s.email}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '10px 14px', background: '#FAF4EC', borderRadius: '8px', fontSize: '13px', color: '#6B3A1F', fontWeight: 500 }}>
              Supplier: {form.supplier}
            </div>
            <Input label="Item Name *" value={form.item} onChange={set('item')} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input label="Quantity *" type="number" value={form.quantity} onChange={set('quantity')} required />
              <Input label="Total Cost (₱) *" type="number" value={form.totalCost} onChange={set('totalCost')} required />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} disabled={!form.item || !form.quantity}>Next</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#FAF4EC', borderRadius: '8px', padding: '16px', fontSize: '13px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <span style={{ color: '#8B5E3C' }}>Supplier:</span><span style={{ fontWeight: 500 }}>{form.supplier}</span>
                <span style={{ color: '#8B5E3C' }}>Item:</span><span style={{ fontWeight: 500 }}>{form.item}</span>
                <span style={{ color: '#8B5E3C' }}>Qty:</span><span style={{ fontWeight: 500 }}>{form.quantity}</span>
                <span style={{ color: '#8B5E3C' }}>Total:</span><span style={{ fontWeight: 500 }}>₱{Number(form.totalCost || 0).toLocaleString()}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
              <Button loading={saving} onClick={handleSubmit}>Confirm Order</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Modal */}
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm" maxWidth="400px">
        <p style={{ fontSize: '14px', color: '#2E1503', marginBottom: '20px' }}>
          {confirmAction?.type === 'cancel' ? 'Cancel this order?' : 'Delete this order permanently?'}
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>No</Button>
          <Button variant="danger" onClick={handleConfirm}>Yes</Button>
        </div>
      </Modal>
    </div>
  );
}
