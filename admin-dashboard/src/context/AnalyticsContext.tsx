// src/context/AnalyticsContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

type Visit = { date: string; visits: number };
type CountryStat = { country: string; users: number };
type Source = { source: string; value: number };

interface AnalyticsContextType {
  visits: Visit[];
  geoStats: CountryStat[];
  trafficSources: Source[];
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [geoStats, setGeoStats] = useState<CountryStat[]>([]);
  const [trafficSources, setTrafficSources] = useState<Source[]>([]);

  useEffect(() => {
    // Моки
    setVisits([
      { date: '2025-07-01', visits: 150 },
      { date: '2025-07-02', visits: 230 },
      { date: '2025-07-03', visits: 180 },
      { date: '2025-07-04', visits: 300 },
    ]);

    setGeoStats([
      { country: 'Россия', users: 120 },
      { country: 'США', users: 90 },
      { country: 'Германия', users: 60 },
      { country: 'Индия', users: 50 },
    ]);

    setTrafficSources([
      { source: 'Google', value: 180 },
      { source: 'Facebook', value: 90 },
      { source: 'Twitter', value: 40 },
      { source: 'Прямой трафик', value: 60 },
    ]);
  }, []);

  return (
    <AnalyticsContext.Provider value={{ visits, geoStats, trafficSources }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) throw new Error('useAnalytics must be used within AnalyticsProvider');
  return context;
};
