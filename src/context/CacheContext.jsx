import { createContext, useRef, useCallback, useMemo } from 'react';
import { CACHE_TTL_MS } from '../utils/constants';

export const CacheContext = createContext(null);

export const CacheProvider = ({ children }) => {
  // Using useRef so cache persists across renders without causing re-renders
  const cacheRef = useRef(new Map());

  /**
   * Get cached data if it exists and hasn't expired.
   * @param {string} key - Cache key (typically the API URL).
   * @returns {any|null} Cached data or null.
   */
  const get = useCallback((key) => {
    const entry = cacheRef.current.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;
    if (isExpired) {
      cacheRef.current.delete(key);
      return null;
    }
    return entry.data;
  }, []);

  /**
   * Store data in cache with a timestamp.
   * @param {string} key - Cache key.
   * @param {any} data - The data to cache.
   */
  const set = useCallback((key, data) => {
    cacheRef.current.set(key, {
      data,
      timestamp: Date.now(),
    });
  }, []);

  /**
   * Remove a specific cache entry.
   * @param {string} key - Cache key to invalidate.
   */
  const invalidate = useCallback((key) => {
    cacheRef.current.delete(key);
  }, []);

  /**
   * Remove all cache entries whose keys contain the given pattern.
   * Useful after CRUD mutations (e.g., invalidatePattern('/todos') clears all todo caches).
   * @param {string} pattern - Substring to match against cache keys.
   */
  const invalidatePattern = useCallback((pattern) => {
    const keys = Array.from(cacheRef.current.keys());
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        cacheRef.current.delete(key);
      }
    });
  }, []);

  /**
   * Clear the entire cache.
   */
  const clearAll = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  // ── Memoize context value ──
  const value = useMemo(
    () => ({ get, set, invalidate, invalidatePattern, clearAll }),
    [get, set, invalidate, invalidatePattern, clearAll]
  );

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
};
