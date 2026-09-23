import React, { useEffect, useState } from 'react';

export default function ScoreGauge({
  score = 85,
  maxScore = 100,
  size = 180,
  strokeWidth = 14,
  label = 'Eligible',
  sublabel = 'Confidence Score',
  color = null,
  showPercentage = true
}) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  // Dynamic status color if not passed explicitly
  let strokeColor = color;
  if (!strokeColor) {
    if (percentage >= 75) strokeColor = 'var(--success)';
    else if (percentage >= 60) strokeColor = 'var(--warning)';
    else strokeColor = 'var(--danger)';
  }

  const gradientId = `gaugeGrad_${Math.round(size)}_${Math.round(score)}`;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      role="progressbar"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={maxScore}
      aria-label={label}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.75" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="1" />
          </linearGradient>
          <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={strokeColor} floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />

        {/* Animated indicator track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter="url(#gaugeGlow)"
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </svg>

      {/* Center content */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none'
        }}
      >
        <div
          className="mono-num"
          style={{
            fontSize: size > 160 ? '2.4rem' : size > 120 ? '1.8rem' : '1.4rem',
            fontWeight: 800,
            lineHeight: 1,
            color: 'var(--text-primary)'
          }}
        >
          {animatedScore}{showPercentage ? '%' : ''}
        </div>

        {label && (
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginTop: '4px',
              color: strokeColor
            }}
          >
            {label}
          </div>
        )}

        {sublabel && size > 140 && (
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              marginTop: '2px'
            }}
          >
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}
