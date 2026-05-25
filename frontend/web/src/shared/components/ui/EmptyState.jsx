import React from 'react';
import Button from './Button';

export default function EmptyState({ icon, title, subtitle, actionLabel, onAction }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: '#F2E4D0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#8B5E3C',
          marginBottom: '16px',
          fontSize: '28px',
        }}
      >
        {icon || '📦'}
      </div>
      <h4
        style={{
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--text-primary, #2E1503)',
          marginBottom: '8px',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {title || 'No items found'}
      </h4>
      <p
        style={{
          fontSize: '14px',
          color: '#8B5E3C',
          maxWidth: '320px',
          lineHeight: 1.5,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {subtitle || 'Get started by adding your first item.'}
      </p>
      {actionLabel && onAction && (
        <div style={{ marginTop: '20px' }}>
          <Button variant="primary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
