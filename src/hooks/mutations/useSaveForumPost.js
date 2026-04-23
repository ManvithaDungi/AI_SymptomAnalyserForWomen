import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveForumPost } from '../../services/firebaseService';
import { logger } from '../../utils/logger';

/**
 * React Query mutation hook for saving a new forum post
 * Automatically invalidates forum posts queries on success
 * @param {Object} options - Additional mutation options
 * @returns {UseMutationResult} { mutate, isPending, error, isError }
 */
export const useSaveForumPost = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData) => saveForumPost(postData),
    onSuccess: () => {
      // Invalidate all forum posts queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['forumPosts'] });
      logger.log('Forum post saved, invalidated cache');
    },
    onError: (error) => {
      logger.error('Failed to save forum post', error);
    },
    ...options,
  });
};
