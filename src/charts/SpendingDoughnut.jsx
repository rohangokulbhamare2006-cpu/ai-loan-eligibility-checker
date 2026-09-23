import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SpendingDoughnut({
  expenses = 35000,
  existingEmi = 15000,
  proposedEmi = 20000,
  surplus = 30000,
  isDark = true
}) {
  const data = {
    labels: ['Living Expenses', 'Existing EMIs', 'Proposed EMI', 'Net Surplus'],
    datasets: [
      {
        data: [expenses, existingEmi, proposedEmi, Math.max(0, surplus)],
        backgroundColor: [
          '#EF4444', // Red for expenses
          '#F59E0B', // Amber for existing debt
          '#38BDF8', // Cyan/Sky for proposed loan
          '#22C55E'  // Emerald for savings surplus
        ],
        borderWidth: 2,
        borderColor: isDark ? '#08111F' : '#FFFFFF',
        hoverOffset: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#94A3B8' : '#475569',
          font: { family: 'Inter', size: 11 },
          padding: 14,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            return ` ${context.label}: ₹${val.toLocaleString('en-IN')}`;
          }
        },
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#F8FAFC',
        bodyColor: '#38BDF8',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10
      }
    },
    cutout: '72%'
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '240px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
