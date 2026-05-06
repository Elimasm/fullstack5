// ── API Configuration ──
export const API_BASE_URL = 'http://localhost:3001';

// ── Cache Configuration ──
export const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ── Pagination ──
export const PHOTOS_PER_PAGE = 12;

// ── Local Storage Keys ──
export const LS_KEYS = {
  CURRENT_USER: 'currentUser',
};

// ── Sort Options ──
export const SORT_OPTIONS = {
  TODOS: [
    { value: 'id', label: 'Sort by ID' },
    { value: 'title', label: 'Sort by Title' },
    { value: 'completed', label: 'Sort by Status' },
  ],
};
