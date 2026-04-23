import { useMutation, useQueryClient } from '@tanstack/react-query';
import { togglePostUpvote } from '../../services/firebaseService';
import { logger } from '../../utils/logger';

/**
 * React Query mutation hook for upvoting/downvoting a forum post
 * Automatically invalidates forum thread queries on success
 * @param {Object} options - Additional mutation options
 * @returns {UseMutationResult} { mutate, isPending, error, isError }
 */
export const useUpvotePost = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }) => togglePostUpvote(postId, userId),
    onSuccess: (_, { postId }) => {
      // Invalidate forum thread queries to refresh the post data
      queryClient.invalidateQueries({ queryKey: ['forumThread', postId] });
      queryClient.invalidateQueries({ queryKey: ['forumPosts'] });
      logger.log('Post upvote toggled, invalidated cache');
    },
    onError: (error) => {
      logger.error('Failed to toggle post upvote', error);
    },
    ...options,
  });
};
