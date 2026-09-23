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

export default function SavingsTrendLine({
  startingSavings = 650000,
  monthlySavingsSurplus = 44000,
  isDark = true
}) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Calculate projected trend with 7% annual yield compounding
  const monthlyRate = 0.07 / 12;
  let currentBalance = startingSavings;
  const trendData = [];

  for (let i = 0; i < 12; i++) {
    currentBalance = (currentBalance + monthlySavingsSurplus) * (1 + monthlyRate);
    trendData.push(Math.round(currentBalance));
  }

  const data = {
    labels: months,
    datasets: [
      {
        label: '12-Month Projected Liquid Wealth (₹)',
        data: trendData,
        borderColor: '#38BDF8',
        backgroundColor: 'rgba(56, 189, 248, 0.12)',
        fill: true,
        tension: 0.38,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#38BDF8',
        borderWidth: 2.5
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
          label: (context) => ` Projected Corpus: ₹${Number(context.raw).toLocaleString('en-IN')}`
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
          callback: (v) => `₹${(v / 100000).toFixed(1)}L`
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
