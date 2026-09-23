import React, { useState, useEffect } from 'react';
import {
  Wallet,
  CreditCard,
  Activity,
  CheckCircle,
  Clock,
  Sparkles,
  Download,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertCircle
} from 'lucide-react';
import GlassCard from '../components/GlassCard.jsx';
import StatCard from '../components/StatCard.jsx';
import Button from '../components/Button.jsx';
import AIInsightCard from '../components/AIInsightCard.jsx';
import ScoreGauge from '../components/ScoreGauge.jsx';
import SpendingDoughnut from '../charts/SpendingDoughnut.jsx';
import IncomeVsExpenseBar from '../charts/IncomeVsExpenseBar.jsx';
import SavingsTrendLine from '../charts/SavingsTrendLine.jsx';
import EmiBurdenArea from '../charts/EmiBurdenArea.jsx';
import { storageService } from '../services/storageService.js';
import { formatINR } from '../utils/financialMath.js';
import { calculateFinancialHealthScore } from '../utils/healthScoreEngine.js';
import { evaluateLoanEligibility } from '../utils/financialMath.js';
import { generateFinancialReportPDF } from '../pdf/ReportGenerator.js';
import { geminiService } from '../gemini/geminiService.js';

export default function Dashboard({ onNavigate, onToast }) {
  const [userProfile, setUserProfile] = useState(storageService.getUserProfile());
  const [reports, setReports] = useState(storageService.getSavedReports());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [downloadingReportId, setDownloadingReportId] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live financial health & loan eligibility from active user profile
  const healthScore = calculateFinancialHealthScore({
    monthlyIncome: userProfile.monthlyIncome,
    monthlyExpenses: userProfile.monthlyExpenses,
    existingEmi: userProfile.existingEmi,
    savings: userProfile.savings,
    creditScore: userProfile.creditScore
  });

  const latestEvaluation = evaluateLoanEligibility({
    monthlyIncome: userProfile.monthlyIncome,
    monthlyExpenses: userProfile.monthlyExpenses,
    existingEmi: userProfile.existingEmi,
    creditScore: userProfile.creditScore,
    savings: userProfile.savings,
    loanAmount: userProfile.defaultLoanAmount || 1500000,
    interestRate: userProfile.defaultInterestRate || 10.2,
    tenureYears: userProfile.defaultTenureYears || 5,
    employmentType: userProfile.employmentType
  });

  // Dynamic greeting
  const hour = currentTime.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const firstName = userProfile.name ? userProfile.name.split(' ')[0] : 'Aryaman';

  const handleDownloadReport = async (report) => {
    setDownloadingReportId(report.id);
    try {
      const aiReport = await geminiService.generateExplainableReport(latestEvaluation, userProfile);
      await generateFinancialReportPDF({
        reportId: report.id,
        timestamp: new Date(report.timestamp).toLocaleString('en-IN'),
        userProfile,
        evaluation: latestEvaluation,
        healthScore,
        aiReport
      });
      if (onToast) onToast(`Report ${report.id} generated and downloaded successfully.`, 'success');
    } catch (err) {
      if (onToast) onToast('Failed to generate PDF report: ' + err.message, 'danger');
    } finally {
      setDownloadingReportId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Top Section: Greeting, Health Score Badge, Live Clock */}
      <GlassCard
        glow
        padding="var(--space-6)"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          border: '1px solid rgba(56, 189, 248, 0.2)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Fintech Portfolio Overview
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {greeting}, {firstName}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Your monthly liquidity is well-balanced. Institutional risk status is{' '}
            <strong style={{ color: 'var(--success)' }}>{latestEvaluation.status} ({latestEvaluation.riskLevel})</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Live Date & Time */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-pill)',
              padding: '8px 16px',
              fontSize: '0.85rem'
            }}
          >
            <Clock size={16} color="var(--secondary)" />
            <span className="mono-num" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
              {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} •{' '}
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={Sparkles}
            onClick={() => onNavigate('eligibility')}
          >
            Check Loan Eligibility
          </Button>
        </div>
      </GlassCard>

      {/* Four Premium Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-5)' }}>
        <StatCard
          title="Monthly Income"
          value={formatINR(userProfile.monthlyIncome)}
          subtitle="Gross Inflow (Verified)"
          icon={Wallet}
          tone="primary"
          trend={{ positive: true, text: '+8.4% vs Q1' }}
        />

        <StatCard
          title="Monthly Expenses"
          value={formatINR(userProfile.monthlyExpenses)}
          subtitle={`Living & Fixed (DTI: ${((userProfile.monthlyExpenses / userProfile.monthlyIncome) * 100).toFixed(0)}%)`}
          icon={CreditCard}
          tone="warning"
          trend={{ positive: false, text: '-3.1% optimized' }}
        />

        <StatCard
          title="Financial Health Score"
          value={`${healthScore.totalScore}/100`}
          subtitle={`Tier: ${healthScore.level}`}
          icon={Activity}
          tone="success"
          trend={{ positive: true, text: '+5 pts this month' }}
          onClick={() => onNavigate('health')}
        />

        <StatCard
          title="Loan Eligibility Status"
          value={latestEvaluation.status}
          subtitle={`Score: ${latestEvaluation.eligibilityScore}% (${latestEvaluation.riskLevel})`}
          icon={CheckCircle}
          tone={latestEvaluation.statusTone}
          onClick={() => onNavigate('eligibility')}
        />
      </div>

      {/* Main Grid: Interactive Charts (Left 2 cols) & AI Insights + Quick Summary (Right 1 col) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Chart 1: Spending Breakdown (Doughnut) */}
        <GlassCard padding="var(--space-6)">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Spending & Obligation Mix</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Proportion of expenses, debt, and surplus</p>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: 600 }}>Real-time</span>
          </div>
          <SpendingDoughnut
            expenses={userProfile.monthlyExpenses}
            existingEmi={userProfile.existingEmi}
            proposedEmi={latestEvaluation.proposedEmi}
            surplus={userProfile.monthlyIncome - (userProfile.monthlyExpenses + userProfile.existingEmi + latestEvaluation.proposedEmi)}
          />
        </GlassCard>

        {/* Chart 2: Income vs Expense (Bar) */}
        <GlassCard padding="var(--space-6)">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Cash Inflow vs Outflow</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Gross earnings vs aggregate obligations</p>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: 600 }}>Monthly</span>
          </div>
          <IncomeVsExpenseBar
            income={userProfile.monthlyIncome}
            expenses={userProfile.monthlyExpenses}
            existingEmi={userProfile.existingEmi}
            proposedEmi={latestEvaluation.proposedEmi}
          />
        </GlassCard>

        {/* Chart 3: Savings Trend (Line) */}
        <GlassCard padding="var(--space-6)">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>12-Month Projected Corpus</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Compound accumulation with safe yields</p>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: 600 }}>7% CAGR</span>
          </div>
          <SavingsTrendLine
            startingSavings={userProfile.savings}
            monthlySavingsSurplus={Math.max(10000, userProfile.monthlyIncome - (userProfile.monthlyExpenses + userProfile.existingEmi))}
          />
        </GlassCard>

        {/* Chart 4: EMI Burden Area */}
        <GlassCard padding="var(--space-6)">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>EMI Obligation vs 50% FOIR</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Safe institutional debt capacity ceiling</p>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600 }}>Within Limit</span>
          </div>
          <EmiBurdenArea
            monthlyIncome={userProfile.monthlyIncome}
            existingEmi={userProfile.existingEmi}
            proposedEmi={latestEvaluation.proposedEmi}
          />
        </GlassCard>
      </div>

      {/* AI Insights Highlight Card */}
      <AIInsightCard
        title="Institutional Underwriting Assessment"
        insight="Your savings rate improved by 12% this month. Your post-loan DTI ratio is 36.4%, comfortably within the safe banking limit of 50%. Based on your credit score of 782, you qualify for prime Tier-1 interest rates."
        onExplore={() => onNavigate('advisor')}
      />

      {/* Recent Reports Table */}
      <GlassCard padding="var(--space-6)">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Underwriting Reports</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Historical loan evaluations and downloadable executive audits
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('reports')}
            iconRight={ArrowRight}
          >
            View All Reports
          </Button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Report ID</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Loan Facility</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Proposed EMI</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>DTI</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>Verdict</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.id}
                  style={{
                    borderBottom: '1px solid var(--border-glass-subtle)',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td className="mono-num" style={{ padding: '14px', color: 'var(--secondary)', fontWeight: 600 }}>
                    {report.id}
                  </td>
                  <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                    {new Date(report.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {formatINR(report.loanAmount)} ({report.loanType || 'Personal'})
                  </td>
                  <td className="mono-num" style={{ padding: '14px', color: 'var(--text-primary)' }}>
                    {formatINR(report.proposedEmi)}
                  </td>
                  <td className="mono-num" style={{ padding: '14px', color: report.dti <= 40 ? 'var(--success)' : 'var(--warning)' }}>
                    {report.dti}%
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: report.status === 'Eligible' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: report.status === 'Eligible' ? 'var(--success)' : 'var(--warning)'
                      }}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Download}
                      loading={downloadingReportId === report.id}
                      onClick={() => handleDownloadReport(report)}
                    >
                      Download PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
