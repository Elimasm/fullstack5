import { useState, useCallback, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../UI/Modal';
import styles from '../../CSS/Header.module.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  const openInfo = useCallback(() => setShowInfo(true), []);
  const closeInfo = useCallback(() => setShowInfo(false), []);

  const navLinks = useMemo(
    () => [
      { to: '/home', label: 'Home', icon: '🏠', end: true },
      { to: '/home/todos', label: 'Todos', icon: '✅' },
      { to: '/home/posts', label: 'Posts', icon: '📝' },
      { to: '/home/albums', label: 'Albums', icon: '📸' },
    ],
    []
  );

  return (
    <>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo}>◆</span>
          <h1 className={styles.appName}>FullStack App</h1>
        </div>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.userSection}>
          <span className={styles.userName}>
            {user?.name || 'User'}
          </span>
          <button className={styles.infoBtn} onClick={openInfo} title="User Info">
            ℹ️
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
            Logout
          </button>
        </div>
      </header>

      {/* User Info Modal */}
      <Modal isOpen={showInfo} onClose={closeInfo} title="User Information">
        {user && (
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Full Name</span>
              <span className={styles.infoValue}>{user.name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Username</span>
              <span className={styles.infoValue}>{user.username}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{user.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Phone</span>
              <span className={styles.infoValue}>{user.phone}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Website</span>
              <span className={styles.infoValue}>{user.website}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Company</span>
              <span className={styles.infoValue}>{user.company?.name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Address</span>
              <span className={styles.infoValue}>
                {user.address?.street}, {user.address?.suite}, {user.address?.city} {user.address?.zipcode}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Header;
