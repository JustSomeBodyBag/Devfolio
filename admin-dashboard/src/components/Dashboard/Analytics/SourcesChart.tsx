import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type SourcesChartProps = {
  data: { source: string; visits: number }[];
};

const SourcesChart: React.FC<SourcesChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((s) => s.source),
    datasets: [
      {
        label: 'Источники трафика',
        data: data.map((s) => s.visits),
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
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default SourcesChart;
