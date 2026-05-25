import React, { useState } from 'react';
import { SkeletonRow } from './Skeleton';
import EmptyState from './EmptyState';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function Table({
  columns,
  data,
  loading = false,
  emptyTitle,
  emptySubtitle,
  emptyAction,
  onEmptyAction,
  onRowClick,
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (!key) return;
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  let sorted = data || [];
  if (sortKey && sorted.length > 0) {
    sorted = [...sorted].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }

  const thStyle = {
    padding: '10px 16px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#6B3A1F',
    background: '#F2E4D0',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    fontFamily: "'Inter', sans-serif",
    cursor: 'pointer',
    userSelect: 'none',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  };

  const tdStyle = {
    padding: '12px 16px',
    fontSize: '13px',
    color: 'var(--text-primary, #2E1503)',
    fontFamily: "'Inter', sans-serif",
    borderBottom: '1px solid #F2E4D0',
  };

  if (!loading && (!data || data.length === 0)) {
    return (
      <EmptyState
        title={emptyTitle || 'No items found'}
        subtitle={emptySubtitle}
        actionLabel={emptyAction}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #F2E4D0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={thStyle}
                onClick={() => col.sortable !== false && handleSort(col.key)}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {col.label}
                  {sortKey === col.key && (
                    sortDir === 'asc'
                      ? <ChevronUp size={12} />
                      : <ChevronDown size={12} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} columns={columns.length} />
              ))
            : sorted.map((row, i) => (
                <tr
                  key={row.id || i}
                  onClick={() => onRowClick?.(row)}
                  style={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background 150ms',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF4EC')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                >
                  {columns.map((col) => (
                    <td key={col.key} style={tdStyle}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>
  );
}
