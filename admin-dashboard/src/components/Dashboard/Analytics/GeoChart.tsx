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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type GeoChartProps = {
  data: { country: string; visits: number }[];
};

const GeoChart: React.FC<GeoChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((g) => g.country),
    datasets: [
      {
        label: 'Пользователи',
        data: data.map((g) => g.visits),
        backgroundColor: 'rgba(16, 185, 129, 0.6)', // green-500
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default GeoChart;
