import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAnalytics } from '../../../context/AnalyticsContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GeoChart: React.FC = () => {
  const { geoStats } = useAnalytics();

  const data = {
    labels: geoStats.map((g) => g.country),
    datasets: [
      {
        label: 'Пользователи',
        data: geoStats.map((g) => g.users),
        backgroundColor: 'rgba(16, 185, 129, 0.6)', // green-500
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Позволяет задать высоту контейнера через CSS
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default GeoChart;
