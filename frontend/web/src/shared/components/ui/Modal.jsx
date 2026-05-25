import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ isOpen, onClose, title, children, maxWidth = '560px' }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(26,8,0,0.6)',
            backdropFilter: 'blur(4px)',
            padding: '16px',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-card, #FFFFFF)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(59,31,10,0.14)',
              width: '100%',
              maxWidth,
              maxHeight: '85vh',
              overflow: 'auto',
            }}
          >
            {title && (
              <div
                style={{
                  padding: '20px 24px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary, #2E1503)' }}>
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    color: '#8B5E3C',
                    cursor: 'pointer',
                    padding: '4px',
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            )}
            <div style={{ padding: '20px 24px 24px' }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
