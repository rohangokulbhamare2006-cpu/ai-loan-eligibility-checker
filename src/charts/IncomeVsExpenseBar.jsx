import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function IncomeVsExpenseBar({
  income = 135000,
  expenses = 42000,
  existingEmi = 18500,
  proposedEmi = 30580,
  isDark = true
}) {
  const totalOutflow = expenses + existingEmi + proposedEmi;
  const netRetained = Math.max(0, income - totalOutflow);

  const data = {
    labels: ['Monthly Cash Flow'],
    datasets: [
      {
        label: 'Gross Income',
        data: [income],
        backgroundColor: '#2563EB',
        borderRadius: 8,
        barPercentage: 0.5
      },
      {
        label: 'Fixed Obligations (Expenses + EMIs)',
        data: [totalOutflow],
        backgroundColor: '#F59E0B',
        borderRadius: 8,
        barPercentage: 0.5
      },
      {
        label: 'Net Retained Savings',
        data: [netRetained],
        backgroundColor: '#22C55E',
        borderRadius: 8,
        barPercentage: 0.5
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
      <Bar data={data} options={options} />
    </div>
  );
}
