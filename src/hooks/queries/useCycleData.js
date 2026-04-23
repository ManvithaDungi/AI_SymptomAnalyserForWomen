import { useQuery } from '@tanstack/react-query';
import { getCycleData } from '../../services/firebaseService';

/**
 * React Query hook for fetching cycle data for a user
 * Automatically caches for 5 minutes
 * @param {string} userId - The user ID
 * @returns {UseQueryResult} { data: cycleData, isLoading, error }
 */
export const useCycleData = (userId) => {
  return useQuery({
    queryKey: ['cycleData', userId],
    queryFn: () => getCycleData(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId, // Only fetch if userId is provided
  });
};
