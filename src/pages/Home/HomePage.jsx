import { Outlet } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import styles from '../../CSS/HomePage.module.css';

/**
 * HomePage layout shell.
 * אחראי רק על המבנה הכללי (Header והאזור המרכזי).
 */
const HomePage = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default HomePage;