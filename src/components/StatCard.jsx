import React from 'react';
import GlassCard from './GlassCard.jsx';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = 'primary', // 'primary', 'secondary', 'success', 'warning', 'danger'
  trend = null, // { positive: true, text: '+12% vs last month' }
  className = '',
  onClick
}) {
  const toneColors = {
    primary: {
      bg: 'rgba(37, 99, 235, 0.15)',
      text: '#38BDF8',
      border: 'rgba(37, 99, 235, 0.3)'
    },
    secondary: {
      bg: 'rgba(56, 189, 248, 0.15)',
      text: '#38BDF8',
      border: 'rgba(56, 189, 248, 0.3)'
    },
    success: {
      bg: 'rgba(34, 197, 94, 0.15)',
      text: '#22C55E',
      border: 'rgba(34, 197, 94, 0.3)'
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.15)',
      text: '#F59E0B',
      border: 'rgba(245, 158, 11, 0.3)'
    },
    danger: {
      bg: 'rgba(239, 68, 68, 0.15)',
      text: '#EF4444',
      border: 'rgba(239, 68, 68, 0.3)'
    }
  };

  const selectedTone = toneColors[tone] || toneColors.primary;

  return (
    <GlassCard
      interactive={!!onClick}
      onClick={onClick}
      className={`stat-card ${className}`}
      padding="var(--space-5) var(--space-6)"
      style={{ cursor: onClick ? 'pointer' : 'default', minHeight: '140px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: selectedTone.bg,
              border: `1px solid ${selectedTone.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: selectedTone.text,
              flexShrink: 0
            }}
          >
            <Icon size={20} strokeWidth={2.2} />
          </div>
        )}
      </div>

      <div
        className="mono-num"
        style={{
          fontSize: '1.85rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: 'var(--space-2)'
        }}
      >
        {value}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
        {trend && (
          <span
            style={{
              fontWeight: 600,
              color: trend.positive ? 'var(--success)' : 'var(--danger)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            {trend.positive ? '↑' : '↓'} {trend.text}
          </span>
        )}
        {subtitle && (
          <span style={{ color: 'var(--text-dim)' }}>
            {subtitle}
          </span>
        )}
      </div>
    </GlassCard>
  );
}
