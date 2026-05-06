import styles from './Pagination.module.css';

/**
 * Load More / Pagination controls for progressive loading.
 */
const Pagination = ({ hasMore, loading, onLoadMore, currentCount, totalCount }) => {
  return (
    <div className={styles.container}>
      {totalCount > 0 && (
        <span className={styles.count}>
          Showing {currentCount} of {totalCount}
        </span>
      )}
      {hasMore && (
        <button
          className={styles.loadMoreBtn}
          onClick={onLoadMore}
          disabled={loading}
        >
          {loading ? (
            <span className={styles.spinner}></span>
          ) : (
            'Load More'
          )}
        </button>
      )}
      {!hasMore && currentCount > 0 && (
        <span className={styles.endMessage}>You've reached the end</span>
      )}
    </div>
  );
};

export default Pagination;
