import React, { useState } from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  prefix = null,
  suffix = null,
  error = null,
  helperText = null,
  required = false,
  isMono = false,
  min,
  max,
  step,
  disabled = false,
  className = '',
  style = {},
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const inputId = id || `inp_${label?.toLowerCase().replace(/\s+/g, '_')}_${Math.random().toString(36).substr(2, 4)}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...style }} className={className}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.85rem',
            fontWeight: 500,
            color: error ? 'var(--danger)' : focused ? 'var(--secondary)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'color var(--transition-fast)'
          }}
        >
          <span>
            {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
          </span>
          {helperText && !error && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 400 }}>
              {helperText}
            </span>
          )}
        </label>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: disabled ? 'rgba(255, 255, 255, 0.02)' : 'var(--bg-input)',
          border: `1px solid ${error ? 'var(--danger)' : focused ? 'var(--border-focus)' : 'var(--border-glass)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '0 12px',
          height: '44px',
          boxShadow: focused ? '0 0 0 3px rgba(56, 189, 248, 0.15)' : 'none',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)'
        }}
      >
        {prefix && (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginRight: '8px', display: 'flex', alignItems: 'center' }}>
            {prefix}
          </span>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={isMono ? 'mono-num' : ''}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            fontFamily: isMono ? 'var(--font-mono)' : 'var(--font-body)',
            width: '100%'
          }}
          {...props}
        />

        {suffix && (
          <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginLeft: '8px' }}>
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <span style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: '2px' }} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
