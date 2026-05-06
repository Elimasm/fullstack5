import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    color: 'var(--text-primary)',
    gap: '16px',
  }}>
    <h1 style={{ fontSize: '4rem', margin: 0, opacity: 0.3 }}>404</h1>
    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Page not found</p>
    <Link to="/home" style={{
      color: 'var(--accent)',
      textDecoration: 'none',
      fontWeight: 600,
      padding: '10px 24px',
      border: '1px solid var(--accent)',
      borderRadius: '10px',
    }}>
      Go Home
    </Link>
  </div>
);

export default NotFoundPage;
