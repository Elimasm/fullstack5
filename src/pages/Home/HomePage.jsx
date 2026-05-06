import { Outlet } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import Dashboard from './Dashboard';
import styles from './HomePage.module.css';

/**
 * HomePage layout shell.
 * Renders the Header (with nav, user info, logout) and an Outlet for nested routes.
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

/**
 * Default landing when user navigates to /home — renders the Dashboard.
 */
export const HomeRedirect = () => <Dashboard />;

export default HomePage;
