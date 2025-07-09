import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useAnalytics } from '../../../context/AnalyticsContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const SourcesChart: React.FC = () => {
  const { trafficSources } = useAnalytics();

  const data = {
    labels: trafficSources.map((s) => s.source),
    datasets: [
      {
        label: 'Источники трафика',
        data: trafficSources.map((s) => s.value),
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)', // blue
          'rgba(234, 88, 12, 0.6)',  // orange
          'rgba(139, 92, 246, 0.6)', // purple
          'rgba(34, 197, 94, 0.6)',  // green
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,  // Контроль размера через CSS контейнер
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default SourcesChart;
