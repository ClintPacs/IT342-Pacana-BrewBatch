import React from 'react';

export default function Skeleton({ width = '100%', height = '16px', borderRadius = '6px', style: customStyle }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #F2E4D0 25%, #FAF4EC 50%, #F2E4D0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...customStyle,
      }}
    />
  );
}

export function SkeletonRow({ columns = 5 }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} style={{ padding: '12px 16px' }}>
          <Skeleton height="14px" width={i === 0 ? '60%' : '80%'} />
        </td>
      ))}
    </tr>
  );
}
