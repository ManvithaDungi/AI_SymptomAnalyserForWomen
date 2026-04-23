import { useQuery } from '@tanstack/react-query';
import { getJournalEntries } from '../../services/firebaseService';

/**
 * React Query hook for fetching journal entries for a user
 * Automatically caches for 5 minutes
 * @param {string} userId - The user ID
 * @param {string} monthKey - Optional month filter (YYYY-MM format)
 * @returns {UseQueryResult} { data: entries, isLoading, error }
 */
export const useJournalEntries = (userId, monthKey = null) => {
  return useQuery({
    queryKey: ['journalEntries', userId, monthKey],
    queryFn: () => getJournalEntries(userId, monthKey),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId, // Only fetch if userId is provided
  });
};
