import React, { useState, useEffect, useContext } from 'react';
import { Trash2, ShieldOff, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../auth/AuthContext';
import adminService from './adminService';
import PageHeader from '../../shared/components/ui/PageHeader';
import Table from '../../shared/components/ui/Table';
import Badge from '../../shared/components/ui/Badge';
import Button from '../../shared/components/ui/Button';
import Modal from '../../shared/components/ui/Modal';

const TABS = ['ALL', 'BARISTA', 'SUPPLIER'];

export default function AdminPage() {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'delete'|'toggle', user }

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAll();
      // filter out the current admin from the list
      const all = (res?.data || []).filter(u => u.id !== currentUser?.id);
      setUsers(all);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const filtered = activeTab === 'ALL'
    ? users
    : users.filter(u => u.role === activeTab);

  const counts = {};
  TABS.forEach(t => {
    counts[t] = t === 'ALL' ? users.length : users.filter(u => u.role === t).length;
  });

  const askConfirm = (type, u) => {
    setConfirmAction({ type, user: u });
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    const { type, user: u } = confirmAction;
    try {
      if (type === 'delete') {
        await adminService.delete(u.id);
        toast.success(`${u.username} deleted`);
      } else {
        await adminService.toggleStatus(u.id);
        toast.success(`${u.username} ${u.active !== false ? 'deactivated' : 'activated'}`);
      }
      setConfirmOpen(false);
      load();
    } catch { toast.error('Action failed'); }
  };

  const columns = [
    {
      key: 'username', label: 'User',
      render: (r) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px', color: '#2E1503' }}>{r.username}</div>
          <div style={{ fontSize: '12px', color: '#8B5E3C' }}>{r.fullName}</div>
        </div>
      )
    },
    { key: 'email', label: 'Email', render: (r) => <span style={{ fontSize: '13px' }}>{r.email}</span> },
    {
      key: 'role', label: 'Role',
      render: (r) => (
        <Badge status={r.role === 'BARISTA' ? 'ACTIVE' : r.role === 'SUPPLIER' ? 'PENDING' : 'APPROVED'}>
          {r.role}
        </Badge>
      )
    },
    {
      key: 'status', label: 'Status',
      render: (r) => <Badge status={r.active !== false ? 'ACTIVE' : 'INACTIVE'} />
    },
    {
      key: 'actions', label: 'Actions', sortable: false,
      render: (r) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          {/* Toggle active/inactive */}
          <button
            onClick={() => askConfirm('toggle', r)}
            title={r.active !== false ? 'Deactivate' : 'Activate'}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'none', border: '1px solid',
              borderColor: r.active !== false ? '#F39C12' : '#27AE60',
              color: r.active !== false ? '#F39C12' : '#27AE60',
              cursor: 'pointer', padding: '5px 10px', borderRadius: '6px',
              fontSize: '11px', fontWeight: 600, fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {r.active !== false
              ? <><ShieldOff size={12} /> Deactivate</>
              : <><ShieldCheck size={12} /> Activate</>}
          </button>

          {/* Delete */}
          <button
            onClick={() => askConfirm('delete', r)}
            title="Delete account"
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'none', border: '1px solid #C0392B', color: '#C0392B',
              cursor: 'pointer', padding: '5px 10px', borderRadius: '6px',
              fontSize: '11px', fontWeight: 600, fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      )
    },
  ];

  return (
    <div>
      <PageHeader title="User Management" breadcrumb="BrewBatch / Admin" />

      {/* Role tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #F2E4D0', marginBottom: '20px' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: activeTab === t ? 600 : 400,
            fontFamily: "'Inter', sans-serif",
            color: activeTab === t ? '#6B3A1F' : '#8B5E3C',
            borderBottom: activeTab === t ? '2px solid #6B3A1F' : '2px solid transparent',
            marginBottom: '-2px', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            {t === 'ALL' ? 'All Users' : t === 'BARISTA' ? '☕ Staff' : '🏭 Suppliers'}
            <span style={{
              fontSize: '11px', fontWeight: 600, padding: '1px 6px', borderRadius: '24px',
              background: activeTab === t ? '#6B3A1F' : '#F2E4D0',
              color: activeTab === t ? '#FFF' : '#8B5E3C',
            }}>{counts[t]}</span>
          </button>
        ))}
      </div>

      <Table
        columns={columns}
        data={filtered}
        loading={loading}
        emptyTitle="No users"
        emptySubtitle="Registered users will appear here."
      />

      {/* Confirm Modal */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={confirmAction?.type === 'delete' ? 'Delete Account' : 'Change Status'}
        maxWidth="400px"
      >
        <div style={{ fontSize: '14px', color: '#2E1503', marginBottom: '20px', lineHeight: '1.6' }}>
          {confirmAction?.type === 'delete' ? (
            <>
              Are you sure you want to <strong>permanently delete</strong> the account of{' '}
              <strong>{confirmAction?.user?.username}</strong>? This cannot be undone.
            </>
          ) : (
            <>
              {confirmAction?.user?.active !== false ? 'Deactivate' : 'Activate'} the account of{' '}
              <strong>{confirmAction?.user?.username}</strong>?
            </>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            variant={confirmAction?.type === 'delete' ? 'danger' : 'primary'}
            onClick={handleConfirm}
          >
            {confirmAction?.type === 'delete' ? 'Delete' : 'Confirm'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
