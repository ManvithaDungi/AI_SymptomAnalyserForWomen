import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  pageSize: number;
}

/**
 * usePagination - Generic pagination state management
 * 
 * Manages pagination for list data with load more functionality.
 * 
 * @param {T[]} items - Array of items to paginate
 * @param {UsePaginationOptions} options - Configuration { pageSize }
 * @returns {Object} - {
 *   visibleItems: T[],
 *   loadMore: () => void,
 *   hasMore: boolean,
 *   currentPage: number,
 *   resetPagination: () => void
 * }
 * 
 * @example
 * const { visibleItems, loadMore, hasMore } = usePagination(allPosts, { pageSize: 10 });
 * return (
 *   <>
 *     {visibleItems.map(p => <PostCard key={p.id} post={p} />)}
 *     {hasMore && <button onClick={loadMore}>Load More</button>}
 *   </>
 * );
 */
export const usePagination = <T,>(
  items: T[],
  options: UsePaginationOptions
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { pageSize } = options;

  const visibleItems = items.slice(0, currentPage * pageSize);
  const hasMore = visibleItems.length < items.length;

  const loadMore = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    visibleItems,
    loadMore,
    hasMore,
    currentPage,
    resetPagination,
  };
};
