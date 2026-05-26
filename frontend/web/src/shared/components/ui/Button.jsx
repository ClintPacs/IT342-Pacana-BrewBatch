import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: {
    background: '#6B3A1F',
    color: '#FFFFFF',
    border: 'none',
    hoverBg: '#4A2008',
  },
  secondary: {
    background: '#FFFFFF',
    color: '#6B3A1F',
    border: '1.5px solid #6B3A1F',
    hoverBg: '#F2E4D0',
  },
  ghost: {
    background: 'transparent',
    color: '#6B3A1F',
    border: 'none',
    hoverBg: '#F2E4D0',
  },
  danger: {
    background: '#C0392B',
    color: '#FFFFFF',
    border: 'none',
    hoverBg: '#A93226',
  },
};

const sizes = {
  sm: { padding: '6px 12px', fontSize: '12px', height: '32px' },
  md: { padding: '8px 16px', fontSize: '14px', height: '40px' },
  lg: { padding: '12px 24px', fontSize: '16px', height: '48px' },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  style: customStyle,
  className,
  ...props
}) {
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: s.fontSize,
    height: s.height,
    padding: s.padding,
    borderRadius: '8px',
    border: v.border,
    background: disabled ? '#D9B896' : v.background,
    color: disabled ? '#8B5E3C' : v.color,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'background 150ms cubic-bezier(0.4,0,0.2,1), transform 150ms',
    opacity: disabled ? 0.6 : 1,
    whiteSpace: 'nowrap',
    minWidth: loading ? s.height : 'auto',
    ...customStyle,
  };

  return (
    <motion.button
      type={type}
      style={baseStyle}
      className={className}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled && !loading ? { background: v.hoverBg } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      {...props}
    >
      {loading ? (
        <span
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTop: `2px solid ${v.color}`,
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      ) : (
        children
      )}
    </motion.button>
  );
}
