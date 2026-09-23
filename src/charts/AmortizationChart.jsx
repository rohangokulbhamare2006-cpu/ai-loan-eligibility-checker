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

export default function AmortizationChart({ yearlySchedule = [], isDark = true }) {
  if (!yearlySchedule.length) return null;

  const labels = yearlySchedule.map(y => `Yr ${y.year}`);
  const principalData = yearlySchedule.map(y => y.principalPaid);
  const interestData = yearlySchedule.map(y => y.interestPaid);

  const data = {
    labels,
    datasets: [
      {
        label: 'Principal Paid',
        data: principalData,
        backgroundColor: '#2563EB',
        borderRadius: 4
      },
      {
        label: 'Interest Paid',
        data: interestData,
        backgroundColor: '#38BDF8',
        borderRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: isDark ? '#94A3B8' : '#475569' }
      },
      y: {
        stacked: true,
        grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
        ticks: {
          color: isDark ? '#94A3B8' : '#475569',
          callback: (v) => `₹${(v / 1000).toFixed(0)}k`
        }
      }
    },
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
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '260px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
