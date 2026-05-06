import { useState, useEffect, useCallback, useRef } from 'react';
import { useCache } from './useCache';

/**
 * Generic data fetching hook with caching, loading, and error states.
 * Uses async/await with try/catch exclusively.
 *
 * @param {string} cacheKey - Unique key for caching (typically the API URL).
 * @param {Function} fetchFn - Async function that returns data.
 * @param {object} options - { enabled: boolean, dependencies: any[] }
 * @returns {{ data, loading, error, refetch }}
 */
export const useFetch = (cacheKey, fetchFn, options = {}) => {
  const { enabled = true, dependencies = [] } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cache = useCache();
  const isMountedRef = useRef(true);

  // Track component mount status
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      setData(cached);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      if (isMountedRef.current) {
        setData(result);
        cache.set(cacheKey, result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message || 'An error occurred while fetching data.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, enabled, ...dependencies]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refetch function that bypasses cache
  const refetch = useCallback(async () => {
    cache.invalidate(cacheKey);
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      if (isMountedRef.current) {
        setData(result);
        cache.set(cacheKey, result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message || 'An error occurred while fetching data.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  return { data, loading, error, refetch };
};
