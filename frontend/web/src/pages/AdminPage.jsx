import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import AdminService from '../services/adminService';

const ROLES = ['ADMIN', 'BARISTA'];

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', fullName: '', role: 'BARISTA' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    loadUsers();
  }, [user, navigate]);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await AdminService.getUsers();
      setUsers(data);
    } catch (e) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditUser(null);
    setForm({ username: '', email: '', fullName: '', role: 'BARISTA' });
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  function openEdit(userRecord) {
    setEditUser(userRecord);
    setForm({
      username: userRecord.username,
      email: userRecord.email,
      fullName: userRecord.fullName || '',
      role: userRecord.role || 'BARISTA',
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
      if (editUser) {
        await AdminService.updateUser(editUser.id, form);
        setSuccess('User updated successfully!');
      } else {
        await AdminService.createUser(form);
        setSuccess('User added successfully!');
      }
      setShowForm(false);
      loadUsers();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save user.');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this user?')) return;
    try {
      await AdminService.deleteUser(id);
      setSuccess('User deleted.');
      loadUsers();
    } catch (e) {
      setError('Failed to delete user.');
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
            <h2 style={s.title}>Admin Panel</h2>
            <button style={s.addBtn} onClick={openAdd}>+ Add User</button>
          </div>

          {success && <div style={s.successBox}>? {success}</div>}
          {error && <div style={s.errorBox}>?? {error}</div>}

          {showForm && (
            <div style={s.formCard}>
              <h3 style={s.formTitle}>{editUser ? 'Edit User' : 'Create User'}</h3>
              <form onSubmit={handleSubmit} style={s.formGrid}>
                <div style={s.formGroup}>
                  <label style={s.label}>Username</label>
                  <input
                    style={s.input}
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Email</label>
                  <input
                    style={s.input}
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Full Name</label>
                  <input
                    style={s.input}
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Role</label>
                  <select
                    style={s.input}
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                  <button type="submit" style={s.saveBtn}>{editUser ? 'Update' : 'Save'}</button>
                  <button type="button" style={s.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  {['Username', 'Full Name', 'Email', 'Role', 'Actions'].map((title) => (
                    <th key={title} style={s.th}>{title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={s.empty}>Loading users...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={5} style={s.empty}>No users found.</td></tr>
                ) : users.map((userRecord) => (
                  <tr key={userRecord.id} style={s.tr}>
                    <td style={s.td}>{userRecord.username}</td>
                    <td style={s.td}>{userRecord.fullName || '�'}</td>
                    <td style={s.td}>{userRecord.email}</td>
                    <td style={s.td}>{userRecord.role || 'BARISTA'}</td>
                    <td style={s.td}>
                      <button style={s.editBtn} onClick={() => openEdit(userRecord)}>Edit</button>
                      <button style={s.archiveBtn} onClick={() => handleDelete(userRecord.id)}>Delete</button>
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
