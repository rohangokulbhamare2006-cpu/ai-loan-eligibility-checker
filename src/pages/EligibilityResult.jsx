import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Download,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  FileText,
  ShieldCheck,
  TrendingUp,
  Percent,
  Wallet,
  Clock
} from 'lucide-react';
import GlassCard from '../components/GlassCard.jsx';
import Button from '../components/Button.jsx';
import ScoreGauge from '../components/ScoreGauge.jsx';
import { formatINR } from '../utils/financialMath.js';
import { generateFinancialReportPDF } from '../pdf/ReportGenerator.js';
import { geminiService } from '../gemini/geminiService.js';
import { googleSheetsService } from '../services/googleSheetsService.js';
import { storageService } from '../services/storageService.js';

export default function EligibilityResult({
  evaluation,
  userProfile,
  healthScore,
  onBack,
  onNavigate,
  onToast
}) {
  const [downloading, setDownloading] = useState(false);
  const [aiReport, setAiReport] = useState(null);
  const [loadingAi, setLoadingAi] = useState(true);

  // Trigger confetti if eligible
  useEffect(() => {
    if (evaluation?.status === 'Eligible') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563EB', '#38BDF8', '#22C55E', '#F59E0B']
        });
      } catch (e) {}
    }

    // Auto-save record to Google Sheets backend storage
    const record = {
      userId: userProfile.id || 'usr_demo',
      name: userProfile.name,
      email: userProfile.email,
      income: userProfile.monthlyIncome,
      expenses: userProfile.monthlyExpenses,
      emi: evaluation.proposedEmi,
      creditScore: userProfile.creditScore,
      financialScore: healthScore.totalScore,
      eligibility: `${evaluation.status} (${evaluation.eligibilityScore}%)`,
      timestamp: new Date().toISOString()
    };
    googleSheetsService.appendRecord(record);

    // Save report into persistent local list
    const newReport = {
      id: 'REP-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toISOString(),
      userName: userProfile.name,
      loanAmount: evaluation.loanAmount,
      loanType: userProfile.loanType || 'Personal Loan',
      interestRate: evaluation.interestRate,
      tenureYears: evaluation.tenureYears,
      eligibilityScore: evaluation.eligibilityScore,
      status: evaluation.status,
      riskLevel: evaluation.riskLevel,
      healthScore: healthScore.totalScore,
      proposedEmi: evaluation.proposedEmi,
      dti: evaluation.proposedDti
    };
    storageService.saveReport(newReport);

    // Fetch explainable Gemini AI analysis
    async function loadAi() {
      setLoadingAi(true);
      try {
        const res = await geminiService.generateExplainableReport(evaluation, userProfile);
        setAiReport(res);
      } catch (err) {
        console.error('Failed to generate AI underwriting audit', err);
      } finally {
        setLoadingAi(false);
      }
    }
    loadAi();
  }, [evaluation, userProfile, healthScore]);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await generateFinancialReportPDF({
        reportId: 'REP-' + Math.floor(100000 + Math.random() * 900000),
        userProfile,
        evaluation,
        healthScore,
        aiReport
      });
      if (onToast) onToast('Deloitte-style audit PDF generated and downloaded.', 'success');
    } catch (err) {
      if (onToast) onToast('PDF Export error: ' + err.message, 'danger');
    } finally {
      setDownloading(false);
    }
  };

  const isEligible = evaluation.status === 'Eligible';
  const isConditional = evaluation.status === 'Conditionally Eligible';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Top Navigation Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <Button variant="ghost" icon={ArrowLeft} onClick={onBack}>
          Modify Parameters
        </Button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            variant="outline"
            icon={Sparkles}
            onClick={() => onNavigate('advisor')}
          >
            Ask AI Advisor
          </Button>

          <Button
            variant="primary"
            icon={Download}
            loading={downloading}
            onClick={handleDownloadPDF}
          >
            Download Executive PDF
          </Button>
        </div>
      </div>

      {/* Main Result Hero Card */}
      <GlassCard
        glow
        padding="var(--space-8)"
        style={{
          border: `1px solid ${isEligible ? 'rgba(34, 197, 94, 0.4)' : isConditional ? 'rgba(245, 158, 11, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
          boxShadow: isEligible
            ? '0 25px 60px -15px rgba(34, 197, 94, 0.25)'
            : '0 25px 60px -15px rgba(0, 0, 0, 0.7)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-8)', alignItems: 'center' }}>
          {/* Left: Large Circular Eligibility Meter */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Institutional Eligibility Meter
            </span>

            <ScoreGauge
              score={evaluation.eligibilityScore}
              maxScore={100}
              size={210}
              strokeWidth={16}
              label={evaluation.status}
              sublabel={evaluation.riskLevel}
            />

            <div style={{ marginTop: 'var(--space-4)' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  background: isEligible ? 'rgba(34, 197, 94, 0.15)' : isConditional ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: isEligible ? 'var(--success)' : isConditional ? 'var(--warning)' : 'var(--danger)',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                {isEligible ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                <span>Underwriting Verdict: {evaluation.status}</span>
              </div>
            </div>
          </div>

          {/* Right: Key Decision Factors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Algorithmic Underwriting Analysis
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '2px' }}>
                {isEligible
                  ? 'Strong Candidate for Prime Lending'
                  : isConditional
                  ? 'Approval Subject to Debt Structuring'
                  : 'Borrowing Capacity Currently Strained'}
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '6px' }}>
                Evaluated for <strong>{formatINR(evaluation.loanAmount)}</strong> at {evaluation.interestRate}% interest over {evaluation.tenureYears} years. 
                Your post-loan Debt-to-Income is calculated at <strong>{evaluation.proposedDti}%</strong>.
              </p>
            </div>

            {/* Quick Component Points */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Credit Score Component</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                  <span className="mono-num" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{userProfile.creditScore}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>+{evaluation.componentScores.credit} pts</span>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>DTI Obligation Weight</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                  <span className="mono-num" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{evaluation.proposedDti}%</span>
                  <span style={{ fontSize: '0.75rem', color: evaluation.componentScores.dti >= 20 ? 'var(--success)' : 'var(--warning)', fontWeight: 600 }}>+{evaluation.componentScores.dti} pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Metrics Grid */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          Prudential Metrics Grid
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
          <GlassCard padding="var(--space-5)">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Proposed Monthly EMI
            </span>
            <div className="mono-num" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
              {formatINR(evaluation.proposedEmi)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Tenure: {evaluation.tenureMonths} Months
            </span>
          </GlassCard>

          <GlassCard padding="var(--space-5)">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Post-Loan DTI Ratio
            </span>
            <div className="mono-num" style={{ fontSize: '1.6rem', fontWeight: 800, color: evaluation.proposedDti <= 40 ? 'var(--success)' : 'var(--warning)', margin: '6px 0 2px' }}>
              {evaluation.proposedDti}%
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Ceiling Benchmark: 50%
            </span>
          </GlassCard>

          <GlassCard padding="var(--space-5)">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Max Affordable EMI
            </span>
            <div className="mono-num" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)', margin: '6px 0 2px' }}>
              {formatINR(evaluation.maxAffordableEmi)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Based on {evaluation.foirLimitPercent}% FOIR
            </span>
          </GlassCard>

          <GlassCard padding="var(--space-5)">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Free Disposable Cash
            </span>
            <div className="mono-num" style={{ fontSize: '1.6rem', fontWeight: 800, color: evaluation.netDisposableAfterLoan > 0 ? 'var(--text-primary)' : 'var(--danger)', margin: '6px 0 2px' }}>
              {formatINR(Math.max(0, evaluation.netDisposableAfterLoan))}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Monthly Surplus post-EMI
            </span>
          </GlassCard>

          <GlassCard padding="var(--space-5)">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Financial Health Score
            </span>
            <div className="mono-num" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)', margin: '6px 0 2px' }}>
              {healthScore.totalScore}/100
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              {healthScore.level} Tier
            </span>
          </GlassCard>

          <GlassCard padding="var(--space-5)">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Max Borrowing Capacity
            </span>
            <div className="mono-num" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
              {formatINR(evaluation.maxAffordableLoan)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              At current income level
            </span>
          </GlassCard>
        </div>
      </div>

      {/* Explainable AI Underwriting Section */}
      <GlassCard padding="var(--space-8)">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-4)' }}>
          <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--secondary)' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
              Explainable AI Underwriting Audit (Gemini)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Zero black-box decisions. Mathematical and behavioral underwriting reasoning.
            </p>
          </div>
        </div>

        {loadingAi ? (
          <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '3px solid rgba(56, 189, 248, 0.2)', borderTopColor: 'var(--secondary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '12px' }}>
              Synthesizing institutional risk metrics with Gemini...
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Executive Summary */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Executive Underwriting Rationale
              </span>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.6, marginTop: '4px' }}>
                {aiReport?.summary}
              </p>
            </div>

            {/* Strengths & Weaknesses Two-Col */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-5)' }}>
              <div style={{ background: 'rgba(34, 197, 94, 0.05)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: 700, marginBottom: '10px' }}>
                  <ShieldCheck size={18} />
                  <span>Key Underwriting Strengths</span>
                </div>
                <ul style={{ paddingLeft: '20px', fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {aiReport?.strengths?.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', fontWeight: 700, marginBottom: '10px' }}>
                  <AlertTriangle size={18} />
                  <span>Risk Watchpoints & Vulnerabilities</span>
                </div>
                <ul style={{ paddingLeft: '20px', fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {aiReport?.weaknesses?.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 30-Day Plan */}
            <div style={{ background: 'rgba(56, 189, 248, 0.04)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '10px' }}>
                Next 30-Day Financial Optimization Roadmap
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                {aiReport?.next30DayPlan?.map((step, idx) => (
                  <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass-subtle)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
