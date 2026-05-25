import React, { useState, useEffect } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import { useAuth } from '../auth/AuthContext';
import OrdersService from './ordersService';
import SuppliersService from '../suppliers/suppliersService';

const STATUSES = ['PENDING', 'APPROVED', 'RECEIVED', 'CANCELLED'];

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [form, setForm] = useState({ supplier: '', item: '', quantity: '', totalCost: '', status: 'PENDING' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadOrders();
    loadSuppliers();
  }, []);

  async function loadOrders() {
    setLoading(true);
    try {
      const data = await OrdersService.getAll();
      setOrders(data);
    } catch (e) {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }

  async function loadSuppliers() {
    try {
      const data = await SuppliersService.getAll();
      setSuppliers(data || []);
    } catch (e) {
      setError('Failed to load suppliers.');
    }
  }

  function openAdd() {
    setEditOrder(null);
    setForm({ supplier: '', item: '', quantity: '', totalCost: '', status: 'PENDING' });
    setError('');
    setSuccess('');
    loadSuppliers();
    setShowForm(true);
  }

  function openEdit(order) {
    setEditOrder(order);
    setForm({
      supplier: order.supplier || '',
      item: order.item || '',
      quantity: order.quantity?.toString() || '',
      totalCost: order.totalCost?.toString() || '',
      status: order.status || 'PENDING',
    });
    setError('');
    setSuccess('');
    loadSuppliers();
    setShowForm(true);
  }

  const parseNumberValue = (value) => {
    if (value === '' || value === null || value === undefined) return undefined;
    return Number(value);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    const payload = {
      supplier: form.supplier,
      item: form.item,
      quantity: parseNumberValue(form.quantity),
      totalCost: parseNumberValue(form.totalCost),
      status: form.status,
    };
    try {
      if (editOrder) {
        await OrdersService.update(editOrder.id, payload);
        setSuccess('Order updated successfully!');
      } else {
        await OrdersService.create(payload);
        setSuccess('Order created successfully!');
      }
      setShowForm(false);
      loadOrders();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save order.');
    }
  }

  async function handleCancel(id) {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await OrdersService.cancel(id);
      setSuccess('Order cancelled.');
      loadOrders();
    } catch (e) {
      setError('Failed to cancel order.');
    }
  }

  async function handleDelete() {
    if (!editOrder) return;
    if (!window.confirm('Delete this cancelled order? This cannot be undone.')) return;
    try {
      await OrdersService.deleteOrder(editOrder.id);
      setSuccess('Order deleted.');
      setShowForm(false);
      loadOrders();
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Failed to delete order.';
      setError(`Delete error: ${msg}`);
    }
  }

  return (
    <div style={s.layout}>
      <nav style={s.topnav}>
        <div style={s.navLogo}>? BrewBatch</div>
        <span style={s.navUser}>Welcome, <strong>{user?.username}</strong></span>
      </nav>
      <div style={s.body}>
        <Sidebar />
        <main style={s.main}>
          <div style={s.titleRow}>
            <h2 style={s.title}>Purchase Orders</h2>
            <button style={s.addBtn} onClick={openAdd}>+ Add Order</button>
          </div>

          {success && <div style={s.successBox}>? {success}</div>}
          {error && <div style={s.errorBox}>?? {error}</div>}

          {showForm && (
            <div style={s.formCard}>
              <h3 style={s.formTitle}>{editOrder ? 'Edit Order' : 'New Order'}</h3>
              <form onSubmit={handleSubmit} style={s.formGrid}>
                <div style={s.formGroup}>
                  <label style={s.label}>Supplier</label>
                  <select
                    style={s.input}
                    value={form.supplier}
                    onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                    required
                  >
                    <option value="" disabled>Select a supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id || supplier.name} value={supplier.name}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Item</label>
                  <input
                    style={s.input}
                    value={form.item}
                    onChange={(e) => setForm({ ...form, item: e.target.value })}
                    required
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Quantity</label>
                  <input
                    style={s.input}
                    type="number"
                    step="1"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    required
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Total Cost</label>
                  <input
                    style={s.input}
                    type="number"
                    step="0.01"
                    value={form.totalCost}
                    onChange={(e) => setForm({ ...form, totalCost: e.target.value })}
                    required
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Status</label>
                  <select
                    style={s.input}
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <button type="submit" style={s.saveBtn}>{editOrder ? 'Update Order' : 'Place Order'}</button>
                  <button type="button" style={s.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                  {editOrder?.status === 'CANCELLED' && (
                    <button type="button" style={s.deleteBtn} onClick={handleDelete}>Delete Order</button>
                  )}
                </div>
              </form>
            </div>
          )}

          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  {['Order', 'Supplier', 'Item', 'Quantity', 'Total', 'Status', 'Actions'].map((title) => (
                    <th key={title} style={s.th}>{title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={s.empty}>Loading orders...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={7} style={s.empty}>No orders found.</td></tr>
                ) : orders.map((order) => (
                  <tr key={order.id} style={s.tr}>
                    <td style={s.td}>#{order.id}</td>
                    <td style={s.td}>{order.supplier}</td>
                    <td style={s.td}>{order.item}</td>
                    <td style={s.td}>{order.quantity}</td>
                    <td style={s.td}>${order.totalCost?.toFixed ? order.totalCost.toFixed(2) : order.totalCost}</td>
                    <td style={s.td}>{order.status}</td>
                    <td style={s.td}>
                      <button style={s.editBtn} onClick={() => openEdit(order)}>Edit</button>
                      <button style={s.archiveBtn} onClick={() => handleCancel(order.id)}>Cancel</button>
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
  titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontFamily: 'serif', fontSize: 22, color: '#2E1503' },
  addBtn: { padding: '8px 18px', background: '#6B3A1F', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  successBox: { background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#27AE60', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13 },
  errorBox: { background: '#FEF2F2', border: '1px solid #FECACA', color: '#C0392B', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13 },
  formCard: { background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 2px 8px rgba(106,58,31,.08)' },
  formTitle: { fontSize: 15, color: '#2E1503', marginBottom: 14, fontFamily: 'serif' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 20 },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 10, fontWeight: 600, color: '#6B3A1F', textTransform: 'uppercase', letterSpacing: 0.7 },
  input: { padding: '8px 10px', border: '1.5px solid #F2E4D0', borderRadius: 7, fontSize: 13, outline: 'none', background: '#FAF4EC' },
  saveBtn: { padding: '9px 20px', background: '#6B3A1F', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 },
  cancelBtn: { padding: '9px 16px', background: '#fff', color: '#6B3A1F', border: '1.5px solid #6B3A1F', borderRadius: 8, cursor: 'pointer', fontSize: 13 },
  deleteBtn: { padding: '9px 16px', background: '#C0392B', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 },
  tableWrap: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(106,58,31,.07)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#F2E4D0' },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B3A1F', textTransform: 'uppercase', letterSpacing: 0.5 },
  tr: { borderBottom: '1px solid #F5F0E8' },
  td: { padding: '10px 14px', fontSize: 13, color: '#2E1503' },
  empty: { padding: '32px', textAlign: 'center', color: '#8B5E3C', fontSize: 13 },
  editBtn: { padding: '4px 10px', background: '#6B3A1F', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 11, marginRight: 6 },
  archiveBtn: { padding: '4px 10px', background: '#fff', color: '#C0392B', border: '1px solid #C0392B', borderRadius: 5, cursor: 'pointer', fontSize: 11 },
};
