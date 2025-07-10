import React from 'react';
import VisitsChart from './VisitsChart';
import GeoChart from './GeoChart';
import SourcesChart from './SourcesChart';
import { useAnalytics } from '../../../hooks/useAnalytics';

const cardClass = "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6";
const chartContainerClass = "w-full overflow-hidden";

const Analytics: React.FC = () => {
  const { visits, geoStats, trafficSources } = useAnalytics();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <section className={cardClass}>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Посещения</h2>
        <div className={`${chartContainerClass} h-80`}>
          <VisitsChart data={visits} />
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">География</h2>
        <div className={`${chartContainerClass} h-96`}>
          <GeoChart data={geoStats} />
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Источники трафика</h2>
        <div className={`${chartContainerClass} h-80`}>
          <SourcesChart data={trafficSources} />
        </div>
      </section>
    </div>
  );
};

export default Analytics;
