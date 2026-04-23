import { useState, useEffect } from 'react';

/**
 * useDebounce - Debounce hook for search and input fields
 * 
 * Delays value updates to reduce rapid state changes, useful for
 * search inputs to avoid excessive API calls.
 * 
 * @param {T} value - The value to debounce
 * @param {number} delay - Debounce delay in milliseconds (default: 500)
 * @returns {T} - The debounced value
 * 
 * @example
 * const searchTerm = useDebounce(inputValue, 300);
 * useEffect(() => {
 *   if (searchTerm) {
 *     // Perform search with debounced term
 *   }
 * }, [searchTerm]);
 */
export const useDebounce = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
