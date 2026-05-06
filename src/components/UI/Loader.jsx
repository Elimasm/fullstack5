import styles from './Loader.module.css';

/**
 * Loading spinner component with optional message.
 */
const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Loader;
