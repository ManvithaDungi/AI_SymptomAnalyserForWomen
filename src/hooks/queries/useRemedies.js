import { useQuery } from '@tanstack/react-query';
import { getRemedies } from '../../services/firebaseService';

/**
 * React Query hook for fetching remedies
 * Automatically caches for 5 minutes
 * @param {string} category - Remedy category filter ('all', 'herbal', etc)
 * @returns {UseQueryResult} { data: remedies, isLoading, error }
 */
export const useRemedies = (category = 'all') => {
  return useQuery({
    queryKey: ['remedies', category],
    queryFn: () => getRemedies(category),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
