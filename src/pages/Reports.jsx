import React, { useState } from 'react';
import {
  FileText,
  Download,
  Trash2,
  ExternalLink,
  Plus,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Search
} from 'lucide-react';
import GlassCard from '../components/GlassCard.jsx';
import Button from '../components/Button.jsx';
import { storageService } from '../services/storageService.js';
import { formatINR } from '../utils/financialMath.js';
import { generateFinancialReportPDF } from '../pdf/ReportGenerator.js';
import { evaluateLoanEligibility } from '../utils/financialMath.js';
import { calculateFinancialHealthScore } from '../utils/healthScoreEngine.js';
import { geminiService } from '../gemini/geminiService.js';

export default function Reports({ onNavigate, onToast }) {
  const [reports, setReports] = useState(storageService.getSavedReports());
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const userProfile = storageService.getUserProfile();

  const filteredReports = reports.filter(r =>
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.loanType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    const updated = storageService.deleteReport(id);
    setReports(updated);
    if (onToast) onToast(`Report ${id} removed from repository.`, 'info');
  };

  const handleDownload = async (report) => {
    setDownloadingId(report.id);
    try {
      const evaluation = evaluateLoanEligibility({
        monthlyIncome: userProfile.monthlyIncome,
        monthlyExpenses: userProfile.monthlyExpenses,
        existingEmi: userProfile.existingEmi,
        creditScore: userProfile.creditScore,
        savings: userProfile.savings,
        loanAmount: report.loanAmount,
        interestRate: report.interestRate || 10.2,
        tenureYears: report.tenureYears || 5,
        employmentType: userProfile.employmentType
      });

      const healthScore = calculateFinancialHealthScore({
        monthlyIncome: userProfile.monthlyIncome,
        monthlyExpenses: userProfile.monthlyExpenses,
        existingEmi: userProfile.existingEmi,
        savings: userProfile.savings,
        creditScore: userProfile.creditScore
      });

      const aiReport = await geminiService.generateExplainableReport(evaluation, userProfile);

      await generateFinancialReportPDF({
        reportId: report.id,
        timestamp: new Date(report.timestamp).toLocaleString('en-IN'),
        userProfile,
        evaluation,
        healthScore,
        aiReport
      });

      if (onToast) onToast(`Executive PDF ${report.id} generated and downloaded.`, 'success');
    } catch (err) {
      if (onToast) onToast('Failed to generate PDF: ' + err.message, 'danger');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            <FileText size={16} />
            <span>Audit & Compliance Repository</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Underwriting Reports
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Deloitte/EY caliber executive financial reports with full underwriting breakdown, explainable AI rationales, and 30-day roadmaps.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => onNavigate('eligibility')}
        >
          New Eligibility Check
        </Button>
      </div>

      {/* Filter Bar */}
      <GlassCard padding="var(--space-4) var(--space-6)" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Report ID, loan type, or verdict status..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.92rem',
            fontFamily: 'var(--font-body)'
          }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Clear
          </button>
        )}
      </GlassCard>

      {/* Reports Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
        {filteredReports.map((report) => (
          <GlassCard
            key={report.id}
            interactive
            padding="var(--space-6)"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '220px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <span className="mono-num" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)' }}>
                  {report.id}
                </span>

                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: report.status === 'Eligible' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: report.status === 'Eligible' ? 'var(--success)' : 'var(--warning)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {report.status === 'Eligible' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                  {report.status}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatINR(report.loanAmount)}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                {report.loanType || 'Personal Loan'} • {report.tenureYears || 5} Years @ {report.interestRate || 10.2}%
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: 'var(--space-4) 0' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Monthly EMI</span>
                  <div className="mono-num" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {formatINR(report.proposedEmi)}
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>DTI Ratio</span>
                  <div className="mono-num" style={{ fontSize: '0.95rem', fontWeight: 700, color: report.dti <= 40 ? 'var(--success)' : 'var(--warning)' }}>
                    {report.dti}%
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <Clock size={14} />
                <span>{new Date(report.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleDelete(report.id)}
                  aria-label="Delete report"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                  title="Remove report"
                >
                  <Trash2 size={16} />
                </button>

                <Button
                  variant="outline"
                  size="sm"
                  icon={Download}
                  loading={downloadingId === report.id}
                  onClick={() => handleDownload(report)}
                >
                  PDF
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <GlassCard padding="var(--space-12)" style={{ textAlign: 'center' }}>
          <FileText size={42} color="var(--text-dim)" style={{ marginBottom: 'var(--space-3)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>No Reports Found</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: 'var(--space-5)' }}>
            Run an eligibility check to generate and save institutional reports.
          </p>
          <Button variant="primary" onClick={() => onNavigate('eligibility')}>
            Check Loan Eligibility
          </Button>
        </GlassCard>
      )}
    </div>
  );
}
