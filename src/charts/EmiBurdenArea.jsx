import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function EmiBurdenArea({
  monthlyIncome = 135000,
  existingEmi = 18500,
  proposedEmi = 30580,
  isDark = true
}) {
  const labels = ['Baseline', 'Existing Loan', '+ Vehicle EMI', '+ Proposed Loan', 'Max FOIR Ceiling'];

  const foir50 = monthlyIncome * 0.50;
  const dataPoints = [
    0,
    existingEmi,
    existingEmi + 8000,
    existingEmi + proposedEmi,
    foir50
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Obligation vs Banking Threshold (₹)',
        data: dataPoints,
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.16)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#8B5CF6',
        pointRadius: 4,
        borderWidth: 2.5
      },
      {
        label: '50% Safe FOIR Limit',
        data: [foir50, foir50, foir50, foir50, foir50],
        borderColor: '#EF4444',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
        borderWidth: 1.5
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDark ? '#94A3B8' : '#475569',
          font: { family: 'Inter', size: 11 },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ₹${Number(context.raw).toLocaleString('en-IN')}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDark ? '#64748B' : '#94A3B8' }
      },
      y: {
        grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
        ticks: {
          color: isDark ? '#64748B' : '#94A3B8',
          callback: (v) => `₹${(v / 1000).toFixed(0)}k`
        }
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '240px' }}>
      <Line data={data} options={options} />
    </div>
  );
}
