import { useContext } from 'react';
import { CacheContext } from '../context/CacheContext';

/**
 * Custom hook to access the cache context.
 * Provides get, set, invalidate, invalidatePattern, clearAll.
 */
export const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
};
