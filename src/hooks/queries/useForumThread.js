import { useQuery } from '@tanstack/react-query';
import { getForumPostById, getPostComments } from '../../services/firebaseService';

/**
 * React Query hook for fetching a single forum post with its comments
 * Automatically caches for 5 minutes
 * @param {string} postId - The forum post ID
 * @returns {UseQueryResult} { data: { post, comments }, isLoading, error }
 */
export const useForumThread = (postId) => {
  return useQuery({
    queryKey: ['forumThread', postId],
    queryFn: async () => {
      const [post, comments] = await Promise.all([
        getForumPostById(postId),
        getPostComments(postId),
      ]);
      return { post, comments };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!postId, // Only fetch if postId is provided
  });
};
