import { useCallback, useRef } from 'react';
import styles from './SearchBar.module.css';

/**
 * Reusable search input component.
 */
const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  const inputRef = useRef(null);

  const handleClear = useCallback(() => {
    onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  return (
    <div className={styles.container}>
      <span className={styles.icon}>🔍</span>
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />
      {value && (
        <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear search">
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
