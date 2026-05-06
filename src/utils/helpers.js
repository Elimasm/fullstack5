/**
 * Sorts an array of objects by a given key.
 * @param {Array} items - The array to sort.
 * @param {string} key - The object key to sort by.
 * @returns {Array} A new sorted array.
 */
export const sortByKey = (items, key) => {
  if (!items || !key) return items;
  return [...items].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (typeof valA === 'boolean') return valA === valB ? 0 : valA ? -1 : 1;
    if (typeof valA === 'number') return valA - valB;
    if (typeof valA === 'string') return valA.localeCompare(valB);
    return 0;
  });
};

/**
 * Filters items by a search query across specified fields.
 * @param {Array} items - The array to filter.
 * @param {string} query - The search string.
 * @param {string[]} fields - The fields to search within.
 * @returns {Array} The filtered array.
 */
export const filterByQuery = (items, query, fields) => {
  if (!items || !query || !fields.length) return items;
  const lowerQuery = query.toLowerCase();
  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      if (value === undefined || value === null) return false;
      return String(value).toLowerCase().includes(lowerQuery);
    })
  );
};

/**
 * Generates a unique temporary ID for optimistic updates.
 * @returns {number} A timestamp-based ID.
 */
export const generateTempId = () => Date.now();

/**
 * Debounce utility for search inputs.
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - Delay in ms.
 * @returns {Function} The debounced function.
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
