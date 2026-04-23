import { useQuery } from '@tanstack/react-query';
import { getSymptomLogs } from '../../services/firebaseService';

/**
 * React Query hook for fetching symptom logs for a user
 * Automatically caches for 5 minutes
 * @param {string} userId - The user ID
 * @returns {UseQueryResult} { data: logs, isLoading, error }
 */
export const useSymptomLogs = (userId) => {
  return useQuery({
    queryKey: ['symptomLogs', userId],
    queryFn: () => getSymptomLogs(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId, // Only fetch if userId is provided
  });
};
