import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({
  message,
  type = 'info', // 'success', 'warning', 'danger', 'info'
  onClose,
  duration = 3800
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const typeConfig = {
    success: { icon: CheckCircle, color: 'var(--success)', border: 'rgba(34, 197, 94, 0.4)' },
    warning: { icon: AlertTriangle, color: 'var(--warning)', border: 'rgba(245, 158, 11, 0.4)' },
    danger: { icon: AlertCircle, color: 'var(--danger)', border: 'rgba(239, 68, 68, 0.4)' },
    info: { icon: Info, color: 'var(--secondary)', border: 'rgba(56, 189, 248, 0.4)' }
  };

  const { icon: Icon, color, border } = typeConfig[type] || typeConfig.info;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${border}`,
        borderRadius: 'var(--radius-md)',
        padding: '12px 18px',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 10000,
        maxWidth: '420px',
        animation: 'fadeIn 0.25s ease'
      }}
      role="alert"
    >
      <Icon size={20} color={color} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', flex: 1 }}>
        {message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
