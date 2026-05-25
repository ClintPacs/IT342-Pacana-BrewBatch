import React from 'react';
import Card from './Card';

export default function StatCard({ icon, value, label, trend, trendUp, color, onClick }) {
  return (
    <Card hover={!!onClick} onClick={onClick} padding="20px">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: '#F2E4D0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6B3A1F',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: color || 'var(--text-primary, #2E1503)',
              lineHeight: 1.1,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {value}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: '#8B5E3C',
              marginTop: '4px',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
            }}
          >
            {label}
          </div>
          {trend !== undefined && (
            <div
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: trendUp ? '#27AE60' : '#C0392B',
                marginTop: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                padding: '2px 6px',
                borderRadius: '24px',
                background: trendUp ? '#F0FDF4' : '#FEF2F2',
              }}
            >
              {trendUp ? '↑' : '↓'} {trend}%
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
