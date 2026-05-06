import styles from './SortSelect.module.css';

/**
 * Reusable sort dropdown component.
 */
const SortSelect = ({ value, onChange, options }) => {
  return (
    <div className={styles.container}>
      <span className={styles.icon}>⇅</span>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort by"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortSelect;
