import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Custom hook that syncs component state with URL search params.
 * Ensures search/sort/filter state persists across page refreshes.
 *
 * @param {object} defaults - Default values for search params, e.g. { search: '', sort: 'id' }
 * @returns {{ params, setParam, setParams, clearParams }}
 */
export const useSearchParamsState = (defaults = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Build current params object from URL, falling back to defaults
  const params = useMemo(() => {
    const current = {};
    Object.keys(defaults).forEach((key) => {
      current[key] = searchParams.get(key) || defaults[key];
    });
    return current;
  }, [searchParams, defaults]);

  // Set a single param
  const setParam = useCallback(
    (key, value) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === '' || value === null || value === undefined) {
            next.delete(key);
          } else {
            next.set(key, value);
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Set multiple params at once
  const setParams = useCallback(
    (updates) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(updates).forEach(([key, value]) => {
            if (value === '' || value === null || value === undefined) {
              next.delete(key);
            } else {
              next.set(key, value);
            }
          });
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Clear all custom params
  const clearParams = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return { params, setParam, setParams, clearParams };
};
