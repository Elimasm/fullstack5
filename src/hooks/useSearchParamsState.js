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
    Object.keys(defaults).forEach((key) => {  // ".../files?search=video&sort=date" for instance will give me the array of keys ['search', 'sort']
      current[key] = searchParams.get(key) || defaults[key]; // creates a dict like {search:"video",sort:"date"} 
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
            next.delete(key); // remove the param from the url, for example if it was "?search=video", it becomes "" and deletes search
          } else {
            next.set(key, value); // add the param to the url, for example "?search=video" will replace video with whatever value is written
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
