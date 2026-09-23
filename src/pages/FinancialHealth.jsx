import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Sliders,
  ArrowRight,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import GlassCard from '../components/GlassCard.jsx';
import Button from '../components/Button.jsx';
import ScoreGauge from '../components/ScoreGauge.jsx';
import { storageService } from '../services/storageService.js';
import { calculateFinancialHealthScore } from '../utils/healthScoreEngine.js';
import { formatINR } from '../utils/financialMath.js';

export default function FinancialHealth({ onNavigate, onToast }) {
  const profile = storageService.getUserProfile();

  // What-If Simulator state
  const [simIncome, setSimIncome] = useState(profile.monthlyIncome);
  const [simExpenses, setSimExpenses] = useState(profile.monthlyExpenses);
  const [simEmi, setSimEmi] = useState(profile.existingEmi);
  const [simSavings, setSimSavings] = useState(profile.savings);
  const [simCreditScore, setSimCreditScore] = useState(profile.creditScore);

  const healthScore = calculateFinancialHealthScore({
    monthlyIncome: simIncome,
    monthlyExpenses: simExpenses,
    existingEmi: simEmi,
    savings: simSavings,
    creditScore: simCreditScore
  });

  const handleReset = () => {
    setSimIncome(profile.monthlyIncome);
    setSimExpenses(profile.monthlyExpenses);
    setSimEmi(profile.existingEmi);
    setSimSavings(profile.savings);
    setSimCreditScore(profile.creditScore);
    if (onToast) onToast('Simulator reset to active profile financials.', 'info');
  };

  const handleApplyToProfile = () => {
    storageService.saveUserProfile({
      monthlyIncome: simIncome,
      monthlyExpenses: simExpenses,
      existingEmi: simEmi,
      savings: simSavings,
      creditScore: simCreditScore
    });
    if (onToast) onToast('Updated financials saved to active portfolio profile.', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            <Activity size={16} />
            <span>Proprietary BFSI Scoring Engine</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Financial Health Score
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            A comprehensive 100-point institutional index evaluating cash flow resilience, debt exposure, and credit discipline.
          </p>
        </div>

        <Button
          variant="secondary"
          icon={Sparkles}
          onClick={() => onNavigate('advisor')}
        >
          Consult AI Advisor
        </Button>
      </div>

      {/* Main Score Hero */}
      <GlassCard
        glow
        padding="var(--space-8)"
        style={{
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-8)', alignItems: 'center' }}>
          {/* Gauge Center */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Aggregate Health Index
            </span>

            <ScoreGauge
              score={healthScore.totalScore}
              maxScore={100}
              size={210}
              strokeWidth={16}
              label={healthScore.level}
              sublabel="Score out of 100"
              showPercentage={false}
            />

            <div style={{ marginTop: 'var(--space-4)' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  background: healthScore.badgeTone === 'success' ? 'rgba(34, 197, 94, 0.15)' : healthScore.badgeTone === 'warning' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: healthScore.badgeTone === 'success' ? 'var(--success)' : healthScore.badgeTone === 'warning' ? 'var(--warning)' : 'var(--danger)',
                  fontWeight: 700,
                  fontSize: '0.88rem'
                }}
              >
                Health Status: {healthScore.level}
              </span>
            </div>
          </div>

          {/* Description & Tier Matrix */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Institutional Standing
              </span>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 700, marginTop: '2px' }}>
                {healthScore.summary}
              </h3>
            </div>

            {/* Health Tiers Reference */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {[
                { range: '90–100', title: 'Excellent', color: 'var(--success)' },
                { range: '75–89', title: 'Good', color: 'var(--secondary)' },
                { range: '60–74', title: 'Average', color: 'var(--warning)' },
                { range: '< 60', title: 'Needs Impr.', color: 'var(--danger)' }
              ].map((tier, idx) => {
                const isActive = (tier.title === healthScore.level) || (tier.title === 'Needs Impr.' && healthScore.level === 'Needs Improvement');
                return (
                  <div
                    key={idx}
                    style={{
                      background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isActive ? tier.color : 'var(--border-glass-subtle)'}`,
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      textAlign: 'center'
                    }}
                  >
                    <span className="mono-num" style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block' }}>{tier.range}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: tier.color }}>{tier.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 4 Pillars Breakdown */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          Detailed 4-Pillar Score Breakdown
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          {healthScore.breakdown.map((pillar) => (
            <GlassCard key={pillar.id} padding="var(--space-6)">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{pillar.title}</h4>
                <span className="mono-num" style={{ fontSize: '1.15rem', fontWeight: 700, color: pillar.score >= 20 ? 'var(--success)' : pillar.score >= 14 ? 'var(--secondary)' : 'var(--warning)' }}>
                  {pillar.score} / {pillar.maxScore}
                </span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                  margin: '10px 0 14px'
                }}
              >
                <div
                  style={{
                    width: `${pillar.percentage}%`,
                    height: '100%',
                    borderRadius: 'var(--radius-pill)',
                    background: pillar.score >= 20
                      ? 'linear-gradient(90deg, #22C55E 0%, #16A34A 100%)'
                      : pillar.score >= 14
                      ? 'linear-gradient(90deg, #38BDF8 0%, #2563EB 100%)'
                      : 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)',
                    transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {pillar.tip}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Interactive What-If Simulator */}
      <GlassCard padding="var(--space-8)">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--secondary)' }}>
              <Sliders size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Interactive "What-If" Simulator</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Slide variables to simulate how repaying debt or growing savings elevates your underwriting score.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleApplyToProfile}>
              Save to Profile
            </Button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-6)' }}>
          {/* Sliders */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Monthly Income</span>
              <span className="mono-num" style={{ fontWeight: 600, color: 'var(--secondary)' }}>{formatINR(simIncome)}</span>
            </div>
            <input
              type="range"
              min="30000"
              max="400000"
              step="5000"
              value={simIncome}
              onChange={(e) => setSimIncome(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-light)', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Monthly Living Expenses</span>
              <span className="mono-num" style={{ fontWeight: 600, color: 'var(--warning)' }}>{formatINR(simExpenses)}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="200000"
              step="2000"
              value={simExpenses}
              onChange={(e) => setSimExpenses(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--warning)', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Existing Ongoing EMIs</span>
              <span className="mono-num" style={{ fontWeight: 600, color: 'var(--danger)' }}>{formatINR(simEmi)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="2000"
              value={simEmi}
              onChange={(e) => setSimEmi(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--danger)', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Liquid Emergency Savings</span>
              <span className="mono-num" style={{ fontWeight: 600, color: 'var(--success)' }}>{formatINR(simSavings)}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="3000000"
              step="25000"
              value={simSavings}
              onChange={(e) => setSimSavings(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--success)', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Credit Bureau Score (CIBIL)</span>
              <span className="mono-num" style={{ fontWeight: 600, color: 'var(--secondary)' }}>{simCreditScore}</span>
            </div>
            <input
              type="range"
              min="300"
              max="900"
              step="5"
              value={simCreditScore}
              onChange={(e) => setSimCreditScore(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--secondary)', cursor: 'pointer' }}
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
