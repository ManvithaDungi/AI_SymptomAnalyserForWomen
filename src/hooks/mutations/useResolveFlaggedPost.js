import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveFlaggedPost } from '../../services/firebaseService';
import { logger } from '../../utils/logger';

/**
 * React Query mutation hook for resolving flagged posts (approve/remove)
 * Automatically invalidates flagged posts queries on success
 * @param {Object} options - Additional mutation options
 * @returns {UseMutationResult} { mutate, isPending, error, isError }
 */
export const useResolveFlaggedPost = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ flagId, resolution }) => resolveFlaggedPost(flagId, resolution),
    onSuccess: () => {
      // Invalidate all flagged posts queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['flaggedPosts'] });
      logger.log('Flagged post resolved, invalidated cache');
    },
    onError: (error) => {
      logger.error('Failed to resolve flagged post', error);
    },
    ...options,
  });
};
