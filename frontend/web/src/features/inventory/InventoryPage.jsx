import React, { useState, useEffect, useCallback } from 'react';
import { Package, Plus, Pencil, Archive } from 'lucide-react';
import toast from 'react-hot-toast';
import inventoryService from './inventoryService';
import PageHeader from '../../shared/components/ui/PageHeader';
import StatCard from '../../shared/components/ui/StatCard';
import Table from '../../shared/components/ui/Table';
import Badge from '../../shared/components/ui/Badge';
import Button from '../../shared/components/ui/Button';
import Modal from '../../shared/components/ui/Modal';
import Input from '../../shared/components/ui/Input';

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [archiveId, setArchiveId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', unit: '', currentStock: '', reorderThreshold: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inventoryService.getAll(search, category);
      setItems(Array.isArray(res) ? res : []);
    } catch { toast.error('Failed to load inventory'); }
    finally { setLoading(false); }
  }, [search, category]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm({ name: '', category: '', unit: '', currentStock: '', reorderThreshold: '' }); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); setForm({ name: item.name, category: item.category, unit: item.unit, currentStock: item.currentStock, reorderThreshold: item.reorderThreshold }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) { await inventoryService.update(editing.id, form); toast.success('Item updated'); }
      else { await inventoryService.create(form); toast.success('Item created'); }
      setModalOpen(false);
      load();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleArchive = async () => {
    try { await inventoryService.archive(archiveId); toast.success('Item archived'); setConfirmOpen(false); load(); }
    catch { toast.error('Failed to archive'); }
  };

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const categories = [...new Set(items.map(i => i.category))];
  const lowStock = items.filter(i => i.isLowStock || i.currentStock <= i.reorderThreshold);

  const columns = [
    { key: 'name', label: 'Item Name', render: (r) => <span style={{ fontWeight: 500 }}>{r.name}</span> },
    { key: 'category', label: 'Category', render: (r) => <Badge status={r.category}>{r.category}</Badge> },
    { key: 'unit', label: 'Unit' },
    { key: 'currentStock', label: 'Stock', render: (r) => (
      <span style={{ fontWeight: 600, color: r.currentStock <= r.reorderThreshold ? '#C0392B' : '#2E1503' }}>
        {r.currentStock}
      </span>
    )},
    { key: 'reorderThreshold', label: 'Threshold' },
    { key: 'status', label: 'Status', render: (r) => <Badge status={r.currentStock <= r.reorderThreshold ? 'LOW STOCK' : 'IN STOCK'} /> },
    { key: 'actions', label: 'Actions', sortable: false, render: (r) => (
      <div style={{ display: 'flex', gap: '4px' }}>
        <button onClick={() => openEdit(r)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B3A1F', padding: '6px', borderRadius: '6px' }}
          onMouseEnter={e => e.currentTarget.style.background = '#F2E4D0'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
          <Pencil size={14} />
        </button>
        <button onClick={() => { setArchiveId(r.id); setConfirmOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C0392B', padding: '6px', borderRadius: '6px' }}
          onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
          <Archive size={14} />
        </button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Inventory" breadcrumb="BrewBatch / Inventory">
        <Button variant="primary" size="md" onClick={openAdd}><Plus size={16} /> Add Item</Button>
      </PageHeader>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard icon={<Package size={20} />} value={items.length} label="Total Items" />
        <StatCard icon={<Package size={20} />} value={categories.length} label="Categories" />
        <StatCard icon={<Package size={20} />} value={lowStock.length} label="Low Stock" color={lowStock.length > 0 ? '#C0392B' : undefined} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ flex: 1, maxWidth: '300px' }}>
          <Input label="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: '6px', border: '1.5px solid #F2E4D0', background: '#FAF4EC', fontSize: '13px', fontFamily: "'Inter', sans-serif", color: '#2E1503' }}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={items}
        loading={loading}
        emptyTitle="No inventory items"
        emptySubtitle="Start by adding your first supply item."
        emptyAction="Add Item"
        onEmptyAction={openAdd}
      />

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Item' : 'Add Item'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Item Name" value={form.name} onChange={set('name')} required />
          <Input label="Category" value={form.category} onChange={set('category')} required />
          <Input label="Unit" value={form.unit} onChange={set('unit')} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Current Stock" type="number" value={form.currentStock} onChange={set('currentStock')} required />
            <Input label="Reorder Threshold" type="number" value={form.reorderThreshold} onChange={set('reorderThreshold')} required />
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={saving}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Archive Modal */}
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Archive Item" maxWidth="400px">
        <p style={{ fontSize: '14px', color: '#2E1503', marginBottom: '20px' }}>Are you sure you want to archive this item? It will be hidden from the active inventory.</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleArchive}>Archive</Button>
        </div>
      </Modal>
    </div>
  );
}