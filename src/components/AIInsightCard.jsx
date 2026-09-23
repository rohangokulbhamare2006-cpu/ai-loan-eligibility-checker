import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import GlassCard from './GlassCard.jsx';
import Button from './Button.jsx';

export default function AIInsightCard({
  title = 'AI Underwriting Insights',
  insight = 'Your savings rate improved by 12% this month. Your DTI ratio is within a healthy institutional range.',
  score = 86,
  onExplore
}) {
  return (
    <GlassCard
      padding="var(--space-6)"
      style={{
        background: 'linear-gradient(145deg, rgba(37, 99, 235, 0.12) 0%, rgba(56, 189, 248, 0.05) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(56, 189, 248, 0.18)',
              color: 'var(--secondary)',
              display: 'flex'
            }}
          >
            <Sparkles size={18} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Gemini Reasoning
          </span>
        </div>

        <span
          style={{
            fontSize: '0.75rem',
            padding: '3px 8px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(34, 197, 94, 0.15)',
            color: 'var(--success)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <ShieldCheck size={13} />
          Verified Math
        </span>
      </div>

      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
        {title}
      </h4>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
        {insight}
      </p>

      {onExplore && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onExplore}
          iconRight={ArrowRight}
        >
          Ask AI Advisor
        </Button>
      )}
    </GlassCard>
  );
}
