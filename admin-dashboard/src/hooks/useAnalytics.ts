import { useAnalyticsContext } from '../context/AnalyticsContext';

export const useAnalytics = () => {
  return useAnalyticsContext();
};
