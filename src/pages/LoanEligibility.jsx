import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  Briefcase,
  IndianRupee,
  Wallet,
  Clock,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle
} from 'lucide-react';
import GlassCard from '../components/GlassCard.jsx';
import Input from '../components/Input.jsx';
import Select from '../components/Select.jsx';
import Button from '../components/Button.jsx';
import EligibilityResult from './EligibilityResult.jsx';
import { storageService } from '../services/storageService.js';
import { evaluateLoanEligibility, formatINR } from '../utils/financialMath.js';
import { calculateFinancialHealthScore } from '../utils/healthScoreEngine.js';

export default function LoanEligibility({ onNavigate, onToast }) {
  const initialProfile = storageService.getUserProfile();

  // Form State
  const [formData, setFormData] = useState({
    name: initialProfile.name || 'Aryaman Sharma',
    age: initialProfile.age || 29,
    occupation: initialProfile.occupation || 'Lead Systems Engineer',
    employmentType: initialProfile.employmentType || 'Salaried',
    monthlyIncome: initialProfile.monthlyIncome || 135000,
    monthlyExpenses: initialProfile.monthlyExpenses || 42000,
    existingEmi: initialProfile.existingEmi || 18500,
    otherLoans: initialProfile.otherLoans || 1,
    savings: initialProfile.savings || 650000,
    creditScore: initialProfile.creditScore || 782,
    loanAmount: initialProfile.defaultLoanAmount || 1500000,
    interestRate: initialProfile.defaultInterestRate || 10.2,
    tenureYears: initialProfile.defaultTenureYears || 5,
    loanType: initialProfile.defaultLoanType || 'Personal Loan'
  });

  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Persist updated profile
    storageService.saveUserProfile(formData);

    // Artificial short delay for high-tech banking verification feel
    await new Promise(r => setTimeout(r, 650));

    const result = evaluateLoanEligibility({
      monthlyIncome: Number(formData.monthlyIncome),
      monthlyExpenses: Number(formData.monthlyExpenses),
      existingEmi: Number(formData.existingEmi),
      creditScore: Number(formData.creditScore),
      savings: Number(formData.savings),
      loanAmount: Number(formData.loanAmount),
      interestRate: Number(formData.interestRate),
      tenureYears: Number(formData.tenureYears),
      employmentType: formData.employmentType
    });

    setEvaluation(result);
    setLoading(false);
    if (onToast) onToast('Institutional loan evaluation completed.', 'success');
  };

  // If evaluation was generated, render EligibilityResult view
  if (evaluation) {
    const healthScore = calculateFinancialHealthScore({
      monthlyIncome: formData.monthlyIncome,
      monthlyExpenses: formData.monthlyExpenses,
      existingEmi: formData.existingEmi,
      savings: formData.savings,
      creditScore: formData.creditScore
    });

    return (
      <EligibilityResult
        evaluation={evaluation}
        userProfile={formData}
        healthScore={healthScore}
        onBack={() => setEvaluation(null)}
        onNavigate={onNavigate}
        onToast={onToast}
      />
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header Banner */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
          <ShieldCheck size={16} />
          <span>Institutional Underwriting Module</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Loan Eligibility Assessment
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Provide applicant details to evaluate borrowing capacity against regulatory FOIR benchmarks and CIBIL credit scoring models.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Section 1: Personal Details */}
        <GlassCard padding="var(--space-6)">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-5)', borderBottom: '1px solid var(--border-glass)', paddingBottom: 'var(--space-3)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'rgba(37, 99, 235, 0.15)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>1. Personal & Employment Profile</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            <Input
              label="Legal Full Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Aryaman Sharma"
              required
            />

            <Input
              label="Age (Years)"
              type="number"
              value={formData.age}
              onChange={(e) => handleChange('age', Number(e.target.value))}
              min="18"
              max="75"
              required
              isMono
            />

            <Input
              label="Occupation / Designation"
              value={formData.occupation}
              onChange={(e) => handleChange('occupation', e.target.value)}
              placeholder="Lead Systems Engineer"
              required
            />

            <Select
              label="Employment Type"
              value={formData.employmentType}
              onChange={(e) => handleChange('employmentType', e.target.value)}
              options={[
                'Salaried',
                'Government',
                'Self-Employed Professional',
                'Business Owner',
                'Freelance / Contract'
              ]}
              required
            />
          </div>
        </GlassCard>

        {/* Section 2: Financial Standing */}
        <GlassCard padding="var(--space-6)">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-5)', borderBottom: '1px solid var(--border-glass)', paddingBottom: 'var(--space-3)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'rgba(34, 197, 94, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>2. Financial Obligations & Liquidity</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            <Input
              label="Gross Monthly Income"
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => handleChange('monthlyIncome', Number(e.target.value))}
              prefix="₹"
              required
              isMono
              helperText={`₹${Number(formData.monthlyIncome).toLocaleString('en-IN')}`}
            />

            <Input
              label="Monthly Living Expenses"
              type="number"
              value={formData.monthlyExpenses}
              onChange={(e) => handleChange('monthlyExpenses', Number(e.target.value))}
              prefix="₹"
              required
              isMono
              helperText={`₹${Number(formData.monthlyExpenses).toLocaleString('en-IN')}`}
            />

            <Input
              label="Existing Monthly EMIs"
              type="number"
              value={formData.existingEmi}
              onChange={(e) => handleChange('existingEmi', Number(e.target.value))}
              prefix="₹"
              required
              isMono
              helperText={`₹${Number(formData.existingEmi).toLocaleString('en-IN')}`}
            />

            <Input
              label="Active Loans Count"
              type="number"
              value={formData.otherLoans}
              onChange={(e) => handleChange('otherLoans', Number(e.target.value))}
              min="0"
              max="20"
              required
              isMono
            />

            <Input
              label="Total Liquid Savings"
              type="number"
              value={formData.savings}
              onChange={(e) => handleChange('savings', Number(e.target.value))}
              prefix="₹"
              required
              isMono
              helperText={`₹${Number(formData.savings).toLocaleString('en-IN')}`}
            />

            <Input
              label="Credit Bureau Score (CIBIL)"
              type="number"
              value={formData.creditScore}
              onChange={(e) => handleChange('creditScore', Number(e.target.value))}
              min="300"
              max="900"
              required
              isMono
              helperText="Range: 300 - 900"
            />
          </div>
        </GlassCard>

        {/* Section 3: Desired Loan Terms */}
        <GlassCard padding="var(--space-6)">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-5)', borderBottom: '1px solid var(--border-glass)', paddingBottom: 'var(--space-3)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sliders size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>3. Loan Facility Parameters</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            <Input
              label="Requested Loan Amount"
              type="number"
              value={formData.loanAmount}
              onChange={(e) => handleChange('loanAmount', Number(e.target.value))}
              prefix="₹"
              min="50000"
              max="50000000"
              step="10000"
              required
              isMono
              helperText={`₹${Number(formData.loanAmount).toLocaleString('en-IN')}`}
            />

            <Input
              label="Indicative Interest Rate"
              type="number"
              value={formData.interestRate}
              onChange={(e) => handleChange('interestRate', Number(e.target.value))}
              suffix="%"
              step="0.1"
              min="4"
              max="30"
              required
              isMono
            />

            <Input
              label="Tenure Horizon (Years)"
              type="number"
              value={formData.tenureYears}
              onChange={(e) => handleChange('tenureYears', Number(e.target.value))}
              suffix="Years"
              min="1"
              max="30"
              required
              isMono
            />

            <Select
              label="Loan Category"
              value={formData.loanType}
              onChange={(e) => handleChange('loanType', e.target.value)}
              options={[
                'Personal Loan',
                'Home Loan / Mortgage',
                'Vehicle / Auto Loan',
                'Education Loan',
                'Business Expansion Loan'
              ]}
              required
            />
          </div>
        </GlassCard>

        {/* Submit Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: 'var(--space-2)' }}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            iconRight={ArrowRight}
            style={{ minWidth: '240px' }}
          >
            Calculate Loan Eligibility
          </Button>
        </div>
      </form>
    </div>
  );
}
