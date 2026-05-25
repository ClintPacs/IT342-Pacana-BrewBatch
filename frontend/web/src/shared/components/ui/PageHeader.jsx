import React from 'react';

export default function PageHeader({ title, breadcrumb, children }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      <div>
        {breadcrumb && (
          <div
            style={{
              fontSize: '12px',
              color: '#8B5E3C',
              marginBottom: '4px',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
            }}
          >
            {breadcrumb}
          </div>
        )}
        <h3
          style={{
            fontSize: '22px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary, #2E1503)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {title}
        </h3>
      </div>
      {children && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {children}
        </div>
      )}
    </div>
  );
}
