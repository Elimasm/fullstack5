import { useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../CSS/Dashboard.module.css';

const Dashboard = () => {
  const { user } = useAuth();

  const greeting = useMemo(() => { // useMemo is used to memoize the greeting so it doesn't recalculate on every render but only on the first render 
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  return (
    <div className={styles.dashboard}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.greeting}>{greeting} 👋</span>
          <h2 className={styles.userName}>{user?.name || 'User'}</h2>
          <p className={styles.subtitle}>
            Click on the menu on the header to explore your dashboard and manage your account settings.
          </p>
        </div>
        <div className={styles.heroGlow} />
      </section>
    </div>
  );
};

export default Dashboard;