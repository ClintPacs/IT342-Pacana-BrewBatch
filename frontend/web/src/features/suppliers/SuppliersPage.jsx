import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import suppliersService from './suppliersService';
import api from '../../shared/services/api';
import PageHeader from '../../shared/components/ui/PageHeader';
import Card from '../../shared/components/ui/Card';
import Button from '../../shared/components/ui/Button';
import Modal from '../../shared/components/ui/Modal';
import Input from '../../shared/components/ui/Input';
import EmptyState from '../../shared/components/ui/EmptyState';
import Skeleton from '../../shared/components/ui/Skeleton';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageOpen, setMessageOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [msgForm, setMsgForm] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const res = await suppliersService.getAll(); setSuppliers(Array.isArray(res) ? res : []); }
    catch { toast.error('Failed to load suppliers'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openMessage = (supplier) => {
    setSelectedSupplier(supplier);
    setMsgForm({ subject: '', message: '' });
    setMessageOpen(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedSupplier?.email) {
      toast.error('Supplier has no email');
      return;
    }
    setSending(true);
    try {
      await api.post('/api/notifications/send', {
        email: selectedSupplier.email,
        subject: msgForm.subject,
        message: msgForm.message,
      });
      toast.success(`Message sent to ${selectedSupplier.name}!`);
      setMessageOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <PageHeader title="Suppliers" breadcrumb="BrewBatch / Suppliers" />

      {/* Info banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 16px', borderRadius: '8px', marginBottom: '24px',
        background: '#EFF6FF', border: '1px solid rgba(41,128,185,0.2)',
        fontSize: '13px', color: '#2E1503', fontFamily: "'Inter', sans-serif",
      }}>
        <span style={{ fontSize: '16px' }}>ℹ️</span>
        Suppliers appear here automatically when they register on the platform. Use the <strong style={{ margin: '0 4px' }}>Message</strong> button to contact them.
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {[1,2,3].map(i => <Skeleton key={i} height="200px" borderRadius="12px" />)}
        </div>
      ) : suppliers.length === 0 ? (
        <EmptyState
          title="No suppliers registered yet"
          subtitle="Suppliers will appear here once they create an account on BrewBatch."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {suppliers.map(s => (
            <Card key={s.id} hover>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6B3A1F 0%, #C4874A 100%)',
                  color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', fontWeight: 600, flexShrink: 0,
                }}>
                  {s.name?.[0]?.toUpperCase() || 'S'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#2E1503', fontFamily: "'Inter', sans-serif" }}>{s.name}</div>
                  <div style={{ fontSize: '13px', color: '#8B5E3C', marginTop: '2px', fontFamily: "'Inter', sans-serif" }}>{s.contactName}</div>
                </div>
                <div style={{
                  padding: '3px 10px', borderRadius: '20px',
                  background: '#F0FDF4', color: '#27AE60',
                  fontSize: '11px', fontWeight: 600, fontFamily: "'Inter', sans-serif",
                }}>Active</div>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {s.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#2E1503', fontFamily: "'Inter', sans-serif" }}>
                    <Mail size={14} color="#8B5E3C" />{s.email}
                  </div>
                )}
                {s.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#2E1503', fontFamily: "'Inter', sans-serif" }}>
                    <Phone size={14} color="#8B5E3C" />{s.phone}
                  </div>
                )}
                {s.address && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#2E1503', fontFamily: "'Inter', sans-serif" }}>
                    <MapPin size={14} color="#8B5E3C" />{s.address}
                  </div>
                )}
              </div>

              {/* Action */}
              <div style={{ borderTop: '1px solid #F2E4D0', paddingTop: '12px' }}>
                <Button variant="secondary" size="sm" onClick={() => openMessage(s)} style={{ width: '100%' }}>
                  <Send size={14} /> Send Message
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Message Modal */}
      <Modal isOpen={messageOpen} onClose={() => setMessageOpen(false)} title={`Message ${selectedSupplier?.name || 'Supplier'}`}>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Recipient info */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: '8px', background: '#FAF4EC',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#6B3A1F', color: '#FFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: 600,
            }}>
              {selectedSupplier?.name?.[0]?.toUpperCase() || 'S'}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#2E1503' }}>{selectedSupplier?.name}</div>
              <div style={{ fontSize: '12px', color: '#8B5E3C' }}>{selectedSupplier?.email}</div>
            </div>
          </div>

          <Input label="Subject *" value={msgForm.subject} onChange={(e) => setMsgForm({ ...msgForm, subject: e.target.value })} required />

          <div>
            <div style={{ fontSize: '12px', color: '#8B5E3C', marginBottom: '6px', fontWeight: 500 }}>Message *</div>
            <textarea
              value={msgForm.message}
              onChange={(e) => setMsgForm({ ...msgForm, message: e.target.value })}
              required
              rows={5}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '6px',
                border: '1.5px solid #F2E4D0', background: '#FAF4EC',
                fontSize: '14px', fontFamily: "'Inter', sans-serif", color: '#2E1503',
                resize: 'vertical', outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = '#6B3A1F'}
              onBlur={(e) => e.target.style.borderColor = '#F2E4D0'}
              placeholder="Type your message to the supplier..."
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Button variant="secondary" onClick={() => setMessageOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={sending}>
              <Send size={14} /> Send Message
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
