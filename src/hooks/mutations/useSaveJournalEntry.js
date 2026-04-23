import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveJournalEntry } from '../../services/firebaseService';
import { logger } from '../../utils/logger';

/**
 * React Query mutation hook for saving a journal entry
 * Automatically invalidates journal entries queries on success
 * @param {Object} options - Additional mutation options
 * @returns {UseMutationResult} { mutate, isPending, error, isError }
 */
export const useSaveJournalEntry = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, entryData }) => saveJournalEntry(userId, entryData),
    onSuccess: (_, { userId }) => {
      // Invalidate journal entries queries for this user to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['journalEntries', userId] });
      logger.log('Journal entry saved, invalidated cache');
    },
    onError: (error) => {
      logger.error('Failed to save journal entry', error);
    },
    ...options,
  });
};
