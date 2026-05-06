import { useCallback } from 'react';
import styles from './ConfirmDialog.module.css';

/**
 * Confirmation dialog for destructive actions (delete, etc.).
 */
const ConfirmDialog = ({ isOpen, onConfirm, onCancel, message = 'Are you sure?', title = 'Confirm Action' }) => {
  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onCancel();
    },
    [onCancel]
  );

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.dialog} role="alertdialog" aria-modal="true">
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
