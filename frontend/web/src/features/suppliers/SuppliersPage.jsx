import React, { useState, useEffect } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import { useAuth } from '../auth/AuthContext';
import SuppliersService from './suppliersService';

export default function SuppliersPage () {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [form, setForm] = useState({ name: '', contactName: '', email: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {
    setLoading(true);
    try {
      const data = await SuppliersService.getAll();
      setSuppliers(data);
    } catch (e) {
      setError('Failed to load suppliers.');
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditSupplier(null);
    setForm({ name: '', contactName: '', email: '', phone: '', address: '' });
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  function openEdit(supplier) {
    setEditSupplier(supplier);
    setForm({
      name: supplier.name || '',
      contactName: supplier.contactName || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
    });
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editSupplier) {
        await SuppliersService.update(editSupplier.id, form);
        setSuccess('Supplier updated successfully!');
      } else {
        await SuppliersService.create(form);
        setSuccess('Supplier added successfully!');
      }
      setShowForm(false);
      loadSuppliers();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save supplier.');
    }
  }

  async function handleArchive(id) {
    if (!window.confirm('Archive this supplier?')) return;
    try {
      await SuppliersService.archive(id);
      setSuccess('Supplier archived.');
      loadSuppliers();
    } catch (e) {
      setError('Failed to archive supplier.');
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
            <h2 style={s.title}>Supplier Directory</h2>
            <button style={s.addBtn} onClick={openAdd}>+ Add Supplier</button>
          </div>

          {success && <div style={s.successBox}>? {success}</div>}
          {error && <div style={s.errorBox}>?? {error}</div>}

          {showForm && (
            <div style={s.formCard}>
              <h3 style={s.formTitle}>{editSupplier ? 'Edit Supplier' : 'New Supplier'}</h3>
              <form onSubmit={handleSubmit} style={s.formGrid}>
                <div style={s.formGroup}>
                  <label style={s.label}>Supplier Name</label>
                  <input
                    style={s.input}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Contact Name</label>
                  <input
                    style={s.input}
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Email</label>
                  <input
                    style={s.input}
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Phone</label>
                  <input
                    style={s.input}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Address</label>
                  <input
                    style={s.input}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                  <button type="submit" style={s.saveBtn}>{editSupplier ? 'Update' : 'Save'}</button>
                  <button type="button" style={s.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  {['Supplier', 'Contact', 'Email', 'Phone', 'Address', 'Actions'].map((title) => (
                    <th key={title} style={s.th}>{title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={s.empty}>Loading suppliers...</td></tr>
                ) : suppliers.length === 0 ? (
                  <tr><td colSpan={6} style={s.empty}>No suppliers found.</td></tr>
                ) : suppliers.map((supplier) => (
                  <tr key={supplier.id} style={s.tr}>
                    <td style={s.td}>{supplier.name}</td>
                    <td style={s.td}>{supplier.contactName || '�'}</td>
                    <td style={s.td}>{supplier.email || '�'}</td>
                    <td style={s.td}>{supplier.phone || '�'}</td>
                    <td style={s.td}>{supplier.address || '�'}</td>
                    <td style={s.td}>
                      <button style={s.editBtn} onClick={() => openEdit(supplier)}>Edit</button>
                      <button style={s.archiveBtn} onClick={() => handleArchive(supplier.id)}>Archive</button>
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
