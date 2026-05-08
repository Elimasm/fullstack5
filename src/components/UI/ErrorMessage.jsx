import styles from '../../CSS/ErrorMessage.module.css';

/**
 * Error display component with optional retry button.
 */
const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>⚠️</div>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={styles.retryBtn} onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
