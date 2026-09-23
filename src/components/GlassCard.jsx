import React from 'react';

export default function GlassCard({
  children,
  className = '',
  interactive = false,
  glow = false,
  padding = 'var(--space-6)',
  style = {},
  onClick,
  ...props
}) {
  const cardStyle = {
    padding,
    ...style
  };

  const classes = [
    'glass-panel',
    interactive ? 'glass-panel-interactive' : '',
    glow ? 'glass-glow' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={cardStyle}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
