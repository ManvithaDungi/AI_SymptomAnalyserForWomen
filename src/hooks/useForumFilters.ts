import { useState, useCallback } from 'react';

/**
 * useForumFilters - Manages forum filtering and search state
 * 
 * Handles forum topic filtering and search term management.
 * 
 * @returns {Object} - {
 *   activeTopic: string,
 *   setActiveTopic: (topic: string) => void,
 *   searchTerm: string,
 *   setSearchTerm: (term: string) => void,
 *   resetFilters: () => void
 * }
 * 
 * @example
 * const { activeTopic, searchTerm, setActiveTopic, setSearchTerm } = useForumFilters();
 * topics.map(t => (
 *   <button onClick={() => setActiveTopic(t.id)} className={activeTopic === t.id ? 'active' : ''}>
 *     {t.name}
 *   </button>
 * ));
 */
export const useForumFilters = () => {
  const [activeTopic, setActiveTopic] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const resetFilters = useCallback(() => {
    setActiveTopic('all');
    setSearchTerm('');
  }, []);

  return {
    activeTopic,
    setActiveTopic,
    searchTerm,
    setSearchTerm,
    resetFilters,
  };
};
