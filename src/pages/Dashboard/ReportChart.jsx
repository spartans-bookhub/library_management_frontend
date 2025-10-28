// components/BarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const ReportChart = ({ chartData }) => {
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Sample Bar Chart',
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};