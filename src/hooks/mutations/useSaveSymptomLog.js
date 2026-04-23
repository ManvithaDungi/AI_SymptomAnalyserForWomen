import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveSymptomLog } from '../../services/firebaseService';
import { logger } from '../../utils/logger';

/**
 * React Query mutation hook for saving a symptom log
 * Automatically invalidates symptom logs queries on success
 * @param {Object} options - Additional mutation options
 * @returns {UseMutationResult} { mutate, isPending, error, isError }
 */
export const useSaveSymptomLog = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, symptoms, result }) => saveSymptomLog(userId, symptoms, result),
    onSuccess: (_, { userId }) => {
      // Invalidate symptom logs queries for this user to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['symptomLogs', userId] });
      logger.log('Symptom log saved, invalidated cache');
    },
    onError: (error) => {
      logger.error('Failed to save symptom log', error);
    },
    ...options,
  });
};
