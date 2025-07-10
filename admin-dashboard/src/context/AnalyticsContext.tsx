import React, { createContext, useContext, useState, useEffect } from 'react';
import { visitsData, geoData, sourcesData } from '../api/mockAnalytics';

type Visit = { date: string; visits: number };
type CountryStat = { country: string; visits: number };
type Source = { source: string; visits: number };

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
    // Используем данные из mockAnalytics.ts
    setVisits(visitsData);
    setGeoStats(geoData);
    setTrafficSources(sourcesData);
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
