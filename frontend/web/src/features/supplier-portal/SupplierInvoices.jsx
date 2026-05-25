import React, { useState, useEffect, useContext } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../auth/AuthContext';
import supplierPortalService from './supplierPortalService';
import PageHeader from '../../shared/components/ui/PageHeader';
import Table from '../../shared/components/ui/Table';
import Badge from '../../shared/components/ui/Badge';
import Button from '../../shared/components/ui/Button';
import Modal from '../../shared/components/ui/Modal';
import Input from '../../shared/components/ui/Input';

export default function SupplierInvoices() {
  const { user } = useContext(AuthContext);
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ orderId: '', amount: '', invoiceNumber: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [inv, ord] = await Promise.all([
        supplierPortalService.getMyInvoices(),
        supplierPortalService.getMyOrders(),
      ]);
      setInvoices(inv || []);
      setOrders(ord || []);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await supplierPortalService.createInvoice({
        supplierId: user.id,
        orderId: form.orderId ? Number(form.orderId) : null,
        amount: Number(form.amount),
        invoiceNumber: form.invoiceNumber,
        notes: form.notes,
      });
      toast.success('Invoice submitted!');
      setModalOpen(false);
      setForm({ orderId: '', amount: '', invoiceNumber: '', notes: '' });
      load();
    } catch { toast.error('Failed to submit invoice'); }
    finally { setSaving(false); }
  };

  const columns = [
    { key: 'invoiceNumber', label: 'Invoice #', render: (r) => <span style={{ fontWeight: 500 }}>{r.invoiceNumber}</span> },
    { key: 'orderId', label: 'Order', render: (r) => r.orderId ? `#${r.orderId}` : '—' },
    { key: 'amount', label: 'Amount', render: (r) => `₱${(r.amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}` },
    { key: 'status', label: 'Status', render: (r) => <Badge status={r.status} /> },
    { key: 'createdAt', label: 'Submitted', render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—' },
  ];

  return (
    <div>
      <PageHeader title="My Invoices" breadcrumb="Supplier Portal / Invoices">
        <Button variant="primary" size="md" onClick={() => setModalOpen(true)}><Plus size={16} /> New Invoice</Button>
      </PageHeader>

      <Table columns={columns} data={invoices} loading={loading}
        emptyTitle="No invoices yet" emptySubtitle="Submit your first invoice for a completed order."
        emptyAction="New Invoice" onEmptyAction={() => setModalOpen(true)} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Submit Invoice">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#8B5E3C', marginBottom: '6px', fontWeight: 500 }}>Link to Order (optional)</div>
            <select value={form.orderId} onChange={set('orderId')}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1.5px solid #F2E4D0', background: '#FAF4EC', fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
              <option value="">No linked order</option>
              {orders.map(o => <option key={o.id} value={o.id}>#{o.id} — {o.item} (₱{o.totalCost})</option>)}
            </select>
          </div>
          <Input label="Invoice Number" value={form.invoiceNumber} onChange={set('invoiceNumber')} required />
          <Input label="Amount (₱)" type="number" value={form.amount} onChange={set('amount')} required />
          <Input label="Notes" value={form.notes} onChange={set('notes')} />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={saving}>Submit Invoice</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
