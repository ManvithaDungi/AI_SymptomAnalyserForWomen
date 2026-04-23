import { useQuery } from '@tanstack/react-query';
import { getForumPosts } from '../../services/firebaseService';

/**
 * React Query hook for fetching forum posts
 * Automatically caches for 5 minutes and deduplicates requests
 * @param {string} topic - Forum topic filter ('all', 'menstrual', etc)
 * @param {string} sortBy - Sort order ('recent' or 'popular')
 * @param {string} language - Language code ('en', 'ta', etc)
 * @returns {UseQueryResult} { data: posts, isLoading, error }
 */
export const useForumPosts = (topic = 'all', sortBy = 'recent', language = 'en') => {
  return useQuery({
    queryKey: ['forumPosts', topic, sortBy, language],
    queryFn: () => getForumPosts(topic, sortBy, language),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
