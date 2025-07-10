import { useState, useEffect } from "react";
import axios from "../api/axios";

type StatsResponse = {
  visits_per_day: Record<string, number>;
  visits_per_country: Record<string, number>;
  visits_per_source: Record<string, number>;
};

export function useAnalytics() {
  const [visits, setVisits] = useState<{ date: string; visits: number }[]>([]);
  const [geoStats, setGeoStats] = useState<{ country: string; visits: number }[]>([]);
  const [trafficSources, setTrafficSources] = useState<{ source: string; visits: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get<StatsResponse>("/analytics/stats");
        const stats = response.data;

        const visitsData = Object.entries(stats.visits_per_day).map(([date, count]) => ({
          date,
          visits: Number(count),
        }));

        const geoData = Object.entries(stats.visits_per_country).map(([country, count]) => ({
          country,
          visits: Number(count),
        }));

        const sourceData = Object.entries(stats.visits_per_source).map(([source, count]) => ({
          source,
          visits: Number(count),
        }));

        setVisits(visitsData);
        setGeoStats(geoData);
        setTrafficSources(sourceData);
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { visits, geoStats, trafficSources, loading, error };
}
