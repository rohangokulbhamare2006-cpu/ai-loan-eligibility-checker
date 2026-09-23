import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost', 'danger'
  size = 'md', // 'sm', 'md', 'lg'
  icon: Icon = null,
  iconRight: IconRight = null,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
  className = '',
  style = {},
  ...props
}) {
  const sizeStyles = {
    sm: { padding: '6px 14px', fontSize: '0.82rem', height: '34px' },
    md: { padding: '10px 20px', fontSize: '0.92rem', height: '42px' },
    lg: { padding: '14px 28px', fontSize: '1.05rem', height: '52px' }
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    border: 'none',
    outline: 'none',
    transition: 'all var(--transition-fast)',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.55 : 1,
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    ...sizeStyles[size],
    ...style
  };

  let variantStyle = {};
  switch (variant) {
    case 'secondary':
      variantStyle = {
        background: 'rgba(56, 189, 248, 0.12)',
        color: 'var(--secondary)',
        border: '1px solid rgba(56, 189, 248, 0.3)'
      };
      break;
    case 'outline':
      variantStyle = {
        background: 'transparent',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-glass-bright)'
      };
      break;
    case 'ghost':
      variantStyle = {
        background: 'transparent',
        color: 'var(--text-muted)'
      };
      break;
    case 'danger':
      variantStyle = {
        background: 'var(--danger)',
        color: '#ffffff',
        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
      };
      break;
    case 'primary':
    default:
      variantStyle = {
        background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 18px rgba(37, 99, 235, 0.35)'
      };
      break;
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn-premium ${className}`}
      style={{ ...baseStyle, ...variantStyle }}
      {...props}
    >
      {loading ? (
        <span
          style={{
            width: '18px',
            height: '18px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: '#ffffff',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
            display: 'inline-block'
          }}
        />
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 17} strokeWidth={2.2} />}
          <span>{children}</span>
          {IconRight && <IconRight size={size === 'sm' ? 14 : size === 'lg' ? 20 : 17} strokeWidth={2.2} />}
        </>
      )}
    </button>
  );
}
