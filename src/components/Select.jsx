import React, { useState } from 'react';

export default function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  error = null,
  helperText = null,
  required = false,
  className = '',
  style = {},
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const selectId = id || `sel_${label?.toLowerCase().replace(/\s+/g, '_')}_${Math.random().toString(36).substr(2, 4)}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...style }} className={className}>
      {label && (
        <label
          htmlFor={selectId}
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
          background: 'var(--bg-input)',
          border: `1px solid ${error ? 'var(--danger)' : focused ? 'var(--border-focus)' : 'var(--border-glass)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '0 12px',
          height: '44px',
          boxShadow: focused ? '0 0 0 3px rgba(56, 189, 248, 0.15)' : 'none',
          transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
          position: 'relative'
        }}
      >
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            width: '100%',
            appearance: 'none',
            WebkitAppearance: 'none'
          }}
          {...props}
        >
          {options.map((opt, idx) => (
            <option
              key={idx}
              value={typeof opt === 'string' ? opt : opt.value}
              style={{ background: '#0F172A', color: '#F8FAFC' }}
            >
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>

        {/* Custom Chevron Arrow */}
        <div style={{ pointerEvents: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {error && (
        <span style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: '2px' }} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
