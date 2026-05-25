import React from 'react';
import { motion } from 'framer-motion';

export default function Card({
  children,
  hover = false,
  padding = '20px',
  style: customStyle,
  onClick,
  className,
}) {
  const baseStyle = {
    background: 'var(--bg-card, #FFFFFF)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-card, 0 1px 3px rgba(59,31,10,0.07), 0 1px 2px rgba(59,31,10,0.04))',
    padding,
    cursor: onClick ? 'pointer' : 'default',
    ...customStyle,
  };

  if (hover) {
    return (
      <motion.div
        style={baseStyle}
        className={className}
        onClick={onClick}
        whileHover={{
          y: -1,
          boxShadow: '0 4px 12px rgba(59,31,10,0.10)',
          transition: { duration: 0.2 },
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div style={baseStyle} className={className} onClick={onClick}>
      {children}
    </div>
  );
}
