import { useState, useEffect, useCallback } from 'react';

/**
 * Hook that syncs a state value with localStorage.
 *
 * @param {string} key - The localStorage key.
 * @param {any} initialValue - Default value if nothing in localStorage.
 * @returns {[any, Function]} - [storedValue, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      if (storedValue === null || storedValue === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch {
      // Silently fail for storage quota issues
    }
  }, [key, storedValue]);

  const setValue = useCallback((value) => {
    setStoredValue((prev) => {
      const nextValue = typeof value === 'function' ? value(prev) : value;
      return nextValue;
    });
  }, []);

  return [storedValue, setValue];
};
