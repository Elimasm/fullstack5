import { Outlet, Navigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
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
 * Default redirect when user lands on /home without a subroute.
 */
export const HomeRedirect = () => <Navigate to="/home/todos" replace />;

export default HomePage;
