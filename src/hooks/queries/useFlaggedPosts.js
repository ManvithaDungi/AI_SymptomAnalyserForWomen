import { useQuery } from '@tanstack/react-query';
import { getFlaggedPosts } from '../../services/firebaseService';

/**
 * React Query hook for fetching flagged forum posts (admin only)
 * Automatically caches for 5 minutes
 * @param {string} filter - Filter type ('all', 'pending', 'approved', 'removed')
 * @returns {UseQueryResult} { data: flaggedPosts, isLoading, error }
 */
export const useFlaggedPosts = (filter = 'all') => {
  return useQuery({
    queryKey: ['flaggedPosts', filter],
    queryFn: () => getFlaggedPosts(filter),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
