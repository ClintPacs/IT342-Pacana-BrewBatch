import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import supplierPortalService from './supplierPortalService';
import PageHeader from '../../shared/components/ui/PageHeader';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import Input from '../../shared/components/ui/Input';
import Skeleton from '../../shared/components/ui/Skeleton';

export default function SupplierProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', contactName: '', email: '', phone: '', address: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await supplierPortalService.getMyProfile();
      setProfile(res);
      if (res) setForm({ name: res.name || '', contactName: res.contactName || '', email: res.email || '', phone: res.phone || '', address: res.address || '' });
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      await supplierPortalService.updateMyProfile(form);
      toast.success('Profile updated!');
      setEditing(false);
      load();
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="My Profile" breadcrumb="Supplier Portal / Profile" />
        <Skeleton height="300px" borderRadius="12px" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <PageHeader title="My Profile" breadcrumb="Supplier Portal / Profile" />
        <Card>
          <p style={{ color: '#8B5E3C', fontSize: '14px', textAlign: 'center', padding: '40px' }}>
            No supplier profile found. Please contact an administrator to link your account.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My Profile" breadcrumb="Supplier Portal / Profile">
        {!editing && <Button variant="secondary" onClick={() => setEditing(true)}>Edit Profile</Button>}
      </PageHeader>

      <Card style={{ maxWidth: '640px' }}>
        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Company Name" value={form.name} onChange={set('name')} required />
            <Input label="Contact Person" value={form.contactName} onChange={set('contactName')} required />
            <Input label="Email" type="email" value={form.email} onChange={set('email')} required />
            <Input label="Phone" value={form.phone} onChange={set('phone')} />
            <Input label="Address" value={form.address} onChange={set('address')} />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
              <Button variant="primary" loading={saving} onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px 16px', fontSize: '14px' }}>
            {[
              ['Company', profile.name],
              ['Contact', profile.contactName],
              ['Email', profile.email],
              ['Phone', profile.phone || '—'],
              ['Address', profile.address || '—'],
            ].map(([label, value]) => (
              <React.Fragment key={label}>
                <span style={{ color: '#8B5E3C', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>{label}</span>
                <span style={{ color: '#2E1503', fontFamily: "'Inter', sans-serif" }}>{value}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
