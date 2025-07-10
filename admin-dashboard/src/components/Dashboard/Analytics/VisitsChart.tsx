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

type VisitsChartProps = {
  data: { date: string; visits: number }[];
};

const VisitsChart: React.FC<VisitsChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((v) => v.date),
    datasets: [
      {
        label: 'Посещения',
        data: data.map((v) => v.visits),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // blue-500 с прозрачностью
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Контроль высоты через CSS
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default VisitsChart;
