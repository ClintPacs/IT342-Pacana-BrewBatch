import React, { useState } from 'react';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder,
  icon,
  endIcon,
  style: customStyle,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && value !== '';
  const isActive = focused || hasValue;

  const containerStyle = {
    position: 'relative',
    width: '100%',
    marginBottom: error ? '4px' : '0',
  };

  const inputStyle = {
    width: '100%',
    height: '44px',
    padding: icon ? '12px 14px 12px 40px' : '12px 14px',
    paddingRight: endIcon ? '40px' : '14px',
    paddingTop: label ? '18px' : '12px',
    paddingBottom: label ? '6px' : '12px',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    color: '#2E1503',
    background: focused ? '#FFFFFF' : '#FAF4EC',
    border: `1.5px solid ${error ? '#C0392B' : focused ? '#6B3A1F' : '#F2E4D0'}`,
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 150ms, box-shadow 150ms, background 150ms',
    boxShadow: focused && !error ? '0 0 0 3px rgba(107,58,31,0.12)' : 'none',
    ...customStyle,
  };

  const labelStyle = {
    position: 'absolute',
    left: icon ? '40px' : '14px',
    top: isActive ? '6px' : '12px',
    fontSize: isActive ? '11px' : '14px',
    fontWeight: isActive ? 500 : 400,
    color: error ? '#C0392B' : focused ? '#6B3A1F' : '#8B5E3C',
    pointerEvents: 'none',
    transition: 'all 150ms cubic-bezier(0.4,0,0.2,1)',
    fontFamily: "'Inter', sans-serif",
  };

  const iconStyle = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#8B5E3C',
    display: 'flex',
  };

  const endIconStyle = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#8B5E3C',
    display: 'flex',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
  };

  const errorStyle = {
    fontSize: '12px',
    color: '#C0392B',
    marginTop: '4px',
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <div style={containerStyle}>
      {icon && <span style={iconStyle}>{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        placeholder={isActive ? placeholder : ''}
        style={inputStyle}
        required={required}
        {...props}
      />
      {label && <span style={labelStyle}>{label}{required && ' *'}</span>}
      {endIcon && <button type="button" style={endIconStyle} tabIndex={-1}>{endIcon}</button>}
      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
}
