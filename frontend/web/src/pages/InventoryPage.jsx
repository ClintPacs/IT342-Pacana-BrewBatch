import React, { useState, useEffect } from 'react';
import InventoryService from '../services/inventoryService';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Coffee', 'Dairy', 'Syrup', 'Cups', 'Other'];

export default function InventoryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'Coffee', unit: '', currentStock: '', reorderThreshold: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  async function load() {
    setLoading(true);
    try {
      const data = await InventoryService.getAll(
        search || undefined,
        category !== 'All' ? category : undefined
      );
      setItems(data);
    } catch (e) { setError('Failed to load inventory.'); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await InventoryService.getAll(
          search || undefined,
          category !== 'All' ? category : undefined
        );
        setItems(data);
      } catch (e) { 
        setError('Failed to load inventory.'); 
      } finally { 
        setLoading(false); 
      }
    }
    
    load();
  }, [search, category]); // Correct dependencies

  function openAdd() {
    setEditItem(null);
    setForm({ name: '', category: 'Coffee', unit: '', currentStock: '', reorderThreshold: '' });
    setShowForm(true);
    setError(''); setSuccess('');
  }

  function openEdit(item) {
    setEditItem(item);
    setForm({
      name: item.name,
      category: item.category,
      unit: item.unit,
      currentStock: item.currentStock,
      reorderThreshold: item.reorderThreshold,
    });
    setShowForm(true);
    setError(''); setSuccess('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    const payload = {
      ...form,
      currentStock: parseFloat(form.currentStock),
      reorderThreshold: parseFloat(form.reorderThreshold),
    };
    try {
      if (editItem) {
        await InventoryService.update(editItem.id, payload);
        setSuccess('Item updated successfully!');
      } else {
        await InventoryService.create(payload);
        setSuccess('Item added successfully!');
      }
      setShowForm(false);
      load();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save item.');
    }
  }

  async function handleArchive(id) {
    if (!window.confirm('Archive this item?')) return;
    try {
      await InventoryService.archive(id);
      setSuccess('Item archived.');
      load();
    } catch { setError('Failed to archive item.'); }
  }

  const lowStock = items.filter(i => i.isLowStock).length;

  return (
    <div style={s.layout}>
      <nav style={s.topnav}>
        <div style={s.navLogo}>☕ BrewBatch</div>
        <span style={s.navUser}>Welcome, <strong>{user?.username}</strong></span>
      </nav>
      <div style={s.body}>
        <Sidebar />
        <main style={s.main}>
          <div style={s.titleRow}>
            <h2 style={s.title}>Inventory Management</h2>
            <button style={s.addBtn} onClick={openAdd}>+ Add Item</button>
          </div>

          {/* Stat Cards */}
          <div style={s.grid}>
            <div style={s.stat}><div style={s.statVal}>{items.length}</div><div style={s.statLbl}>TOTAL ITEMS</div></div>
            <div style={s.stat}><div style={{ ...s.statVal, color: '#C0392B' }}>{lowStock}</div><div style={s.statLbl}>LOW STOCK</div></div>
            <div style={s.stat}><div style={{ ...s.statVal, color: '#27AE60' }}>{items.length - lowStock}</div><div style={s.statLbl}>IN STOCK</div></div>
          </div>

          {/* Alerts */}
          {success && <div style={s.successBox}>✅ {success}</div>}
          {error && <div style={s.errorBox}>⚠️ {error}</div>}

          {/* Filters */}
          <div style={s.filters}>
            <input
              style={s.search}
              placeholder="🔍 Search items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select style={s.select} value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div style={s.formCard}>
              <h3 style={s.formTitle}>{editItem ? 'Edit Item' : 'Add New Item'}</h3>
              <form onSubmit={handleSubmit} style={s.formGrid}>
                <div style={s.formGroup}>
                  <label style={s.label}>Item Name</label>
                  <input style={s.input} required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Arabica Beans" />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Category</label>
                  <select style={s.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Unit</label>
                  <input style={s.input} required value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="kg, liters, pcs" />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Current Stock</label>
                  <input style={s.input} type="number" step="0.1" required value={form.currentStock} onChange={e => setForm({ ...form, currentStock: e.target.value })} placeholder="0" />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Reorder Threshold</label>
                  <input style={s.input} type="number" step="0.1" required value={form.reorderThreshold} onChange={e => setForm({ ...form, reorderThreshold: e.target.value })} placeholder="0" />
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                  <button type="submit" style={s.saveBtn}>{editItem ? 'Update' : 'Save'}</button>
                  <button type="button" style={s.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  {['Item Name', 'Category', 'Unit', 'Current Stock', 'Threshold', 'Status', 'Actions'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={s.empty}>Loading...</td></tr>
                ) : items.length === 0 ? (
                  <tr><td colSpan={7} style={s.empty}>No items found. Add your first inventory item!</td></tr>
                ) : items.map(item => (
                  <tr key={item.id} style={s.tr}>
                    <td style={s.td}><strong>{item.name}</strong></td>
                    <td style={s.td}>{item.category}</td>
                    <td style={s.td}>{item.unit}</td>
                    <td style={{ ...s.td, color: item.isLowStock ? '#C0392B' : '#2E1503', fontWeight: 600 }}>
                      {item.currentStock}
                    </td>
                    <td style={s.td}>{item.reorderThreshold}</td>
                    <td style={s.td}>
                      <span style={item.isLowStock ? s.badgeLow : s.badgeOk}>
                        {item.isLowStock ? 'LOW STOCK' : 'IN STOCK'}
                      </span>
                    </td>
                    <td style={s.td}>
                      <button style={s.editBtn} onClick={() => openEdit(item)}>Edit</button>
                      <button style={s.archiveBtn} onClick={() => handleArchive(item.id)}>Archive</button>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 },
  stat: { background: '#fff', borderRadius: 10, padding: '14px 18px', boxShadow: '0 2px 8px rgba(106,58,31,.07)' },
  statVal: { fontSize: 28, fontWeight: 700, color: '#2E1503', fontFamily: 'serif' },
  statLbl: { fontSize: 9, color: '#8B5E3C', textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 },
  successBox: { background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#27AE60', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13 },
  errorBox: { background: '#FEF2F2', border: '1px solid #FECACA', color: '#C0392B', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13 },
  filters: { display: 'flex', gap: 10, marginBottom: 16 },
  search: { flex: 1, padding: '9px 12px', border: '1.5px solid #F2E4D0', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff' },
  select: { padding: '9px 12px', border: '1.5px solid #F2E4D0', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff' },
  formCard: { background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 2px 8px rgba(106,58,31,.08)' },
  formTitle: { fontSize: 15, color: '#2E1503', marginBottom: 14, fontFamily: 'serif' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 },
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
  badgeOk: { background: '#F0FDF4', color: '#27AE60', border: '1px solid #BBF7D0', borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700 },
  badgeLow: { background: '#FEF2F2', color: '#C0392B', border: '1px solid #FECACA', borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700 },
  editBtn: { padding: '4px 10px', background: '#6B3A1F', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 11, marginRight: 6 },
  archiveBtn: { padding: '4px 10px', background: '#fff', color: '#C0392B', border: '1px solid #C0392B', borderRadius: 5, cursor: 'pointer', fontSize: 11 },
};