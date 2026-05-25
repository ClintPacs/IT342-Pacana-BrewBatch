import React from 'react';

const statusMap = {
  PENDING:    { bg: '#FFFBEB', color: '#F39C12', label: 'Pending' },
  APPROVED:   { bg: '#F0FDF4', color: '#27AE60', label: 'Approved' },
  'IN STOCK': { bg: '#F0FDF4', color: '#27AE60', label: 'In Stock' },
  ACTIVE:     { bg: '#F0FDF4', color: '#27AE60', label: 'Active' },
  SUBMITTED:  { bg: '#EFF6FF', color: '#2980B9', label: 'Submitted' },
  CANCELLED:  { bg: '#FEF2F2', color: '#C0392B', label: 'Cancelled' },
  'LOW STOCK':{ bg: '#FEF2F2', color: '#C0392B', label: 'Low Stock' },
  ERROR:      { bg: '#FEF2F2', color: '#C0392B', label: 'Error' },
  INACTIVE:   { bg: '#FEF2F2', color: '#C0392B', label: 'Inactive' },
  RECEIVED:   { bg: '#EFF6FF', color: '#2980B9', label: 'Received' },
  COMPLETED:  { bg: '#EFF6FF', color: '#2980B9', label: 'Completed' },
  PAID:       { bg: '#F0FDF4', color: '#27AE60', label: 'Paid' },
  UNDER_REVIEW:{ bg: '#FFFBEB', color: '#F39C12', label: 'Under Review' },
};

export default function Badge({ status, children, style: customStyle }) {
  const s = statusMap[status?.toUpperCase()] || { bg: '#F2E4D0', color: '#8B5E3C', label: status };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: '24px',
        fontSize: '11px',
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        background: s.bg,
        color: s.color,
        whiteSpace: 'nowrap',
        lineHeight: '18px',
        ...customStyle,
      }}
    >
      {children || s.label || status}
    </span>
  );
}
