import { useState, useCallback } from 'react';

/**
 * Hook for progressive/paginated loading of items.
 *
 * @param {Function} fetchFn - Async function: (page, limit) => { data, hasMore, totalCount }
 * @param {number} pageSize - Items per page.
 * @returns {{ items, page, hasMore, loading, error, loadMore, reset }}
 */
export const usePagination = (fetchFn, pageSize = 12) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn(page, pageSize);
      setItems((prev) => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err.message || 'Failed to load more items.');
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, pageSize, loading, hasMore]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
    setError(null);
  }, []);

  return { items, setItems, page, hasMore, loading, error, loadMore, reset };
};
