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
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAnalytics } from '../../../context/AnalyticsContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const VisitsChart: React.FC = () => {
  const { visits } = useAnalytics();

  const data = {
    labels: visits.map((v) => v.date),
    datasets: [
      {
        label: 'Посещения',
        data: visits.map((v) => v.visits),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // blue-500 с прозрачностью
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,  // Важно для контроля высоты через CSS
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default VisitsChart;
