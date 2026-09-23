import React, { useState } from 'react';
import {
  Shield,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  Lock,
  CheckCircle2,
  PieChart,
  Cpu,
  BarChart3,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import GlassCard from '../components/GlassCard.jsx';
import Button from '../components/Button.jsx';
import ScoreGauge from '../components/ScoreGauge.jsx';
import { formatINR } from '../utils/financialMath.js';

export default function LandingPage({ onGetStarted, onNavigate }) {
  const [sampleIncome, setSampleIncome] = useState(120000);
  const [sampleLoan, setSampleLoan] = useState(1500000);

  // Quick live math for interactive hero widget
  const monthlyRate = 10.5 / 1200;
  const sampleEmi = Math.round((sampleLoan * monthlyRate * Math.pow(1 + monthlyRate, 60)) / (Math.pow(1 + monthlyRate, 60) - 1));
  const sampleDti = ((sampleEmi / sampleIncome) * 100).toFixed(1);

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Hero Section */}
      <section
        style={{
          padding: 'var(--space-12) var(--space-6) var(--space-16)',
          maxWidth: '1280px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Floating Fintech Tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            marginBottom: 'var(--space-6)',
            animation: 'fadeIn 0.6s ease'
          }}
        >
          <Sparkles size={16} color="var(--secondary)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary)' }}>
            Next-Gen BFSI Underwriting Intelligence
          </span>
        </div>

        {/* Product Title */}
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            marginBottom: 'var(--space-5)',
            maxWidth: '1000px',
            margin: '0 auto var(--space-5)'
          }}
        >
          Check your eligibility.{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #38BDF8 0%, #2563EB 50%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Understand the reason.
          </span>{' '}
          Improve your financial future.
        </h1>

        <p
          style={{
            fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '740px',
            margin: '0 auto var(--space-8)',
            lineHeight: 1.6
          }}
        >
          Not just an EMI calculator. An intelligent financial decision platform with explainable Gemini AI, true institutional banking calculations, and Deloitte-grade executive audits.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: 'var(--space-12)' }}>
          <Button
            size="lg"
            variant="primary"
            onClick={onGetStarted}
            iconRight={ArrowRight}
          >
            Check Loan Eligibility
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => onNavigate('emi')}
            icon={PieChart}
          >
            Smart EMI Calculator
          </Button>
        </div>

        {/* Live Interactive Hero Dashboard Card */}
        <div style={{ maxWidth: '980px', margin: '0 auto', textAlign: 'left' }}>
          <GlassCard
            glow
            padding="var(--space-8)"
            style={{
              border: '1px solid rgba(56, 189, 248, 0.3)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 50px -10px rgba(37, 99, 235, 0.25)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Live Preview Simulation
                  </span>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '2px' }}>
                  Instant Decision Engine
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.06)', padding: '5px 12px', borderRadius: 'var(--radius-pill)', color: 'var(--text-muted)' }}>
                  FOIR Cap: 50%
                </span>
                <span style={{ fontSize: '0.78rem', background: 'rgba(34, 197, 94, 0.15)', color: 'var(--success)', padding: '5px 12px', borderRadius: 'var(--radius-pill)', fontWeight: 600 }}>
                  Credit Benchmark: 750+
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)', alignItems: 'center' }}>
              {/* Left: Interactive Sliders */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Monthly Income</span>
                    <span className="mono-num" style={{ fontWeight: 600, color: 'var(--secondary)' }}>{formatINR(sampleIncome)}</span>
                  </div>
                  <input
                    type="range"
                    min="30000"
                    max="300000"
                    step="5000"
                    value={sampleIncome}
                    onChange={(e) => setSampleIncome(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary-light)', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Desired Loan Amount</span>
                    <span className="mono-num" style={{ fontWeight: 600, color: 'var(--secondary)' }}>{formatINR(sampleLoan)}</span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="5000000"
                    step="50000"
                    value={sampleLoan}
                    onChange={(e) => setSampleLoan(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--secondary)', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Monthly EMI (5Y @ 10.5%)</span>
                    <span className="mono-num" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatINR(sampleEmi)}</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Projected DTI Ratio</span>
                    <span className="mono-num" style={{ fontSize: '1.15rem', fontWeight: 700, color: sampleDti <= 45 ? 'var(--success)' : 'var(--warning)' }}>{sampleDti}%</span>
                  </div>
                </div>
              </div>

              {/* Right: Score Gauge & Decision */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)', borderLeft: '1px solid var(--border-glass)' }}>
                <ScoreGauge
                  score={sampleDti <= 35 ? 91 : sampleDti <= 45 ? 82 : sampleDti <= 55 ? 68 : 45}
                  maxScore={100}
                  size={150}
                  label={sampleDti <= 45 ? 'Eligible' : sampleDti <= 55 ? 'Conditional' : 'High Risk'}
                  sublabel="Approval Confidence"
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px' }}>
                  Calculated against institutional underwriting rules.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: 'var(--space-12) var(--space-6)', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
            Engineered for Modern Banking Intelligence
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Built to provide absolute clarity into credit committee decisions and personal cash flow optimization.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
          <GlassCard interactive padding="var(--space-6)">
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'rgba(37, 99, 235, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8', marginBottom: 'var(--space-4)' }}>
              <Cpu size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Explainable Gemini AI</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              No black-box rejections. Understand the exact financial strengths, risk factors, and underwriting rationale behind every evaluation.
            </p>
          </GlassCard>

          <GlassCard interactive padding="var(--space-6)">
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'rgba(34, 197, 94, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', marginBottom: 'var(--space-4)' }}>
              <TrendingUp size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Real Banking Formulas</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Built strictly with reducing balance EMI algorithms, Fixed Obligation to Income Ratio (FOIR), and liquidity buffer checks.
            </p>
          </GlassCard>

          <GlassCard interactive padding="var(--space-6)">
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)', marginBottom: 'var(--space-4)' }}>
              <BarChart3 size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>100-Point Health Index</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Analyze your financial fitness across 4 core pillars: Savings Habit, Debt Management, Credit Behaviour, and EMI Burden.
            </p>
          </GlassCard>

          <GlassCard interactive padding="var(--space-6)">
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'rgba(139, 92, 246, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA', marginBottom: 'var(--space-4)' }}>
              <FileText size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Executive PDF Reports</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Export Deloitte / EY caliber advisory audit documents with complete charts, underwriting breakdowns, and 30-day roadmaps.
            </p>
          </GlassCard>

          <GlassCard interactive padding="var(--space-6)">
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22D3EE', marginBottom: 'var(--space-4)' }}>
              <PieChart size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Interactive Amortization</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Inspect month-by-month and year-by-year principal vs interest paydown schedules with CSV export capabilities.
            </p>
          </GlassCard>

          <GlassCard interactive padding="var(--space-6)">
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F87171', marginBottom: 'var(--space-4)' }}>
              <Lock size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Fintech Grade Privacy</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Zero credential leakage. Client-side state security, automated session expiry, and optional direct Google Sheets sync.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: 'var(--space-12) var(--space-6)', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
            How It Works in 4 Steps
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>A seamless institutional evaluation pipeline</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)' }}>
          {[
            { step: '01', title: 'Input Financials', desc: 'Provide verified monthly income, fixed obligations, credit score, and desired loan terms.' },
            { step: '02', title: 'Banking Math', desc: 'Our algorithmic engine computes DTI, FOIR, disposable cash margin, and maximum affordable EMI.' },
            { step: '03', title: 'Gemini AI Audit', desc: 'Explainable AI assesses risk volatility and constructs custom 30-day financial action plans.' },
            { step: '04', title: 'Export & Consult', desc: 'Download professional PDF reports and consult the interactive AI Advisor in real time.' }
          ].map((item, idx) => (
            <GlassCard key={idx} padding="var(--space-6)">
              <span className="mono-num" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', opacity: 0.6, display: 'block', marginBottom: '8px' }}>
                {item.step}
              </span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>{item.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-glass)',
          padding: 'var(--space-12) var(--space-6) var(--space-8)',
          maxWidth: '1280px',
          margin: 'var(--space-12) auto 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-6)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={24} color="var(--secondary)" />
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
            AI LOAN ELIGIBILITY CHECKER
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '600px' }}>
          Production-grade BFSI financial decision platform. Built for borrowers, wealth advisors, and modern retail lending teams.
        </p>

        <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: 'var(--text-dim)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span>© 2026 CREDLEND AI. All rights reserved.</span>
          <span>•</span>
          <span style={{ cursor: 'pointer', color: 'var(--secondary)' }} onClick={() => onNavigate('dashboard')}>Launch Dashboard</span>
          <span>•</span>
          <span style={{ cursor: 'pointer', color: 'var(--secondary)' }} onClick={() => onNavigate('advisor')}>AI Advisor</span>
          <span>•</span>
          <span style={{ cursor: 'pointer', color: 'var(--secondary)' }} onClick={() => onNavigate('reports')}>Reports</span>
        </div>
      </footer>
    </div>
  );
}
