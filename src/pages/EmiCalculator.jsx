import React, { useState } from 'react';
import {
  PieChart as PieIcon,
  Download,
  Sliders,
  DollarSign,
  TrendingDown,
  Calendar,
  Percent,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import GlassCard from '../components/GlassCard.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { calculateEMI, formatINR } from '../utils/financialMath.js';
import { generateAmortizationSchedule } from '../utils/amortization.js';
import AmortizationChart from '../charts/AmortizationChart.jsx';
import SpendingDoughnut from '../charts/SpendingDoughnut.jsx';
import { Doughnut } from 'react-chartjs-2';

export default function EmiCalculator({ onToast }) {
  const [principal, setPrincipal] = useState(1500000);
  const [interestRate, setInterestRate] = useState(10.2);
  const [tenureYears, setTenureYears] = useState(5);
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' or 'table'

  const schedule = generateAmortizationSchedule(principal, interestRate, tenureYears);
  const emi = schedule.emi;
  const totalInterest = schedule.totalInterest;
  const totalPayment = schedule.totalPayment;
  const interestRatio = Math.round((totalInterest / totalPayment) * 100);

  // Doughnut data for Principal vs Interest
  const pieData = {
    labels: ['Principal Amount', 'Total Interest'],
    datasets: [
      {
        data: [principal, totalInterest],
        backgroundColor: ['#2563EB', '#38BDF8'],
        borderColor: '#08111F',
        borderWidth: 2
      }
    ]
  };

  const handleExportCSV = () => {
    const headers = ['Year', 'Annual EMI Paid', 'Principal Paid', 'Interest Paid', 'Ending Balance'];
    const rows = schedule.yearlySchedule.map(y => [
      y.year,
      y.totalEmi,
      y.principalPaid,
      y.interestPaid,
      y.endingBalance
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Amortization_Schedule_${principal}_${tenureYears}Y.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onToast) onToast('Amortization schedule downloaded as CSV.', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            <PieIcon size={16} />
            <span>Smart Amortization & Repayment Engine</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Smart EMI Calculator
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Calculate exact reducing-balance installments, inspect principal-interest curves, and review multi-year amortization schedules.
          </p>
        </div>

        <Button
          variant="outline"
          icon={FileSpreadsheet}
          onClick={handleExportCSV}
        >
          Export Schedule CSV
        </Button>
      </div>

      {/* Main Grid: Inputs Left, Live Summary Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Left: Interactive Controls */}
        <GlassCard padding="var(--space-6)">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 'var(--space-5)' }}>
            Loan Parameters
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Principal */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Loan Principal Amount
                </label>
                <span className="mono-num" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)' }}>
                  {formatINR(principal)}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="20000000"
                step="50000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-light)', cursor: 'pointer', marginBottom: '8px' }}
              />
              <Input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                prefix="₹"
                min="10000"
                step="10000"
                isMono
              />
            </div>

            {/* Interest */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Annual Interest Rate (%)
                </label>
                <span className="mono-num" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)' }}>
                  {interestRate}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="24"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--secondary)', cursor: 'pointer', marginBottom: '8px' }}
              />
              <Input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                suffix="%"
                step="0.1"
                isMono
              />
            </div>

            {/* Tenure */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Tenure Horizon
                </label>
                <span className="mono-num" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)' }}>
                  {tenureYears} Years ({tenureYears * 12} Months)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-purple)', cursor: 'pointer', marginBottom: '8px' }}
              />
              <Input
                type="number"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                suffix="Years"
                min="1"
                max="30"
                isMono
              />
            </div>
          </div>
        </GlassCard>

        {/* Right: Calculated Outputs & Breakdown */}
        <GlassCard
          glow
          padding="var(--space-6)"
          style={{
            border: '1px solid rgba(56, 189, 248, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Calculated Monthly Installment
            </span>
            <div
              className="mono-num"
              style={{
                fontSize: 'clamp(2.2rem, 4vw, 3rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
                margin: '4px 0 16px'
              }}
            >
              {formatINR(emi)}
              <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '6px' }}>
                / month
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: 'var(--space-6)' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Principal Amount</span>
                <div className="mono-num" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38BDF8', marginTop: '2px' }}>
                  {formatINR(principal)}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Interest</span>
                <div className="mono-num" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F59E0B', marginTop: '2px' }}>
                  {formatINR(totalInterest)}
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass-bright)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Payment (Principal + Interest)</span>
                <span className="mono-num" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {formatINR(totalPayment)}
                </span>
              </div>
            </div>
          </div>

          {/* Visual Ratio Bar */}
          <div style={{ marginTop: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
              <span>Principal: {(100 - interestRatio)}%</span>
              <span>Interest: {interestRatio}%</span>
            </div>
            <div style={{ width: '100%', height: '10px', borderRadius: 'var(--radius-pill)', background: '#F59E0B', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${100 - interestRatio}%`,
                  height: '100%',
                  background: '#2563EB',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Amortization Chart & Repayment Schedule */}
      <GlassCard padding="var(--space-6)">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Amortization Breakdown</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Detailed yearly schedule of principal amortization and interest payout
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant={activeTab === 'chart' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('chart')}
            >
              Stacked Chart
            </Button>
            <Button
              variant={activeTab === 'table' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('table')}
            >
              Schedule Table
            </Button>
          </div>
        </div>

        {activeTab === 'chart' ? (
          <div>
            <AmortizationChart yearlySchedule={schedule.yearlySchedule} />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Year</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Total EMI Paid</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Principal Paid</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>Interest Paid</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'right' }}>Ending Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.yearlySchedule.map((row) => (
                  <tr
                    key={row.year}
                    style={{ borderBottom: '1px solid var(--border-glass-subtle)' }}
                  >
                    <td className="mono-num" style={{ padding: '12px 14px', color: 'var(--secondary)', fontWeight: 600 }}>
                      Year {row.year}
                    </td>
                    <td className="mono-num" style={{ padding: '12px 14px', color: 'var(--text-primary)' }}>
                      {formatINR(row.totalEmi)}
                    </td>
                    <td className="mono-num" style={{ padding: '12px 14px', color: '#38BDF8' }}>
                      {formatINR(row.principalPaid)}
                    </td>
                    <td className="mono-num" style={{ padding: '12px 14px', color: '#F59E0B' }}>
                      {formatINR(row.interestPaid)}
                    </td>
                    <td className="mono-num" style={{ padding: '12px 14px', color: 'var(--text-secondary)', textAlign: 'right' }}>
                      {formatINR(row.endingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
