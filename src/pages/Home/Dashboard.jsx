import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCache } from '../../hooks/useCache';
import { getTodosByUserId } from '../../api/todosApi';
import { getPostsByUserId } from '../../api/postsApi';
import { getAlbumsByUserId } from '../../api/albumsApi';
import Loader from '../../components/UI/Loader';
import styles from './Dashboard.module.css';

/**
 * Dashboard — the main Home landing page (/home).
 * Shows a welcome hero, live stat cards, navigation tiles, and recent activity.
 */
const Dashboard = () => {
  const { user } = useAuth();
  const cache = useCache();
  const navigate = useNavigate();

  const [todos, setTodos] = useState(null);
  const [posts, setPosts] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Fetch all stats in parallel ──
  const fetchStats = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const cacheKeys = {
      todos: `/todos?userId=${user.id}`,
      posts: `/posts?userId=${user.id}`,
      albums: `/albums?userId=${user.id}`,
    };

    try {
      const [todosData, postsData, albumsData] = await Promise.all([
        cache.get(cacheKeys.todos) || getTodosByUserId(user.id).then((d) => { cache.set(cacheKeys.todos, d); return d; }),
        cache.get(cacheKeys.posts) || getPostsByUserId(user.id).then((d) => { cache.set(cacheKeys.posts, d); return d; }),
        cache.get(cacheKeys.albums) || getAlbumsByUserId(user.id).then((d) => { cache.set(cacheKeys.albums, d); return d; }),
      ]);

      setTodos(todosData);
      setPosts(postsData);
      setAlbums(albumsData);
    } catch {
      // Silently fall back — dashboard still renders without stats
    } finally {
      setLoading(false);
    }
  }, [user, cache]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // ── Computed stats ──
  const stats = useMemo(() => {
    const completedTodos = todos ? todos.filter((t) => t.completed).length : 0;
    const totalTodos = todos ? todos.length : 0;
    const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

    return {
      totalTodos,
      completedTodos,
      pendingTodos: totalTodos - completedTodos,
      completionRate,
      totalPosts: posts ? posts.length : 0,
      totalAlbums: albums ? albums.length : 0,
    };
  }, [todos, posts, albums]);

  // ── Greeting based on time ──
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  // ── Recent todos (last 5) ──
  const recentTodos = useMemo(() => {
    if (!todos) return [];
    return [...todos].reverse().slice(0, 5);
  }, [todos]);

  if (loading) return <Loader message="Loading dashboard..." />;

  return (
    <div className={styles.dashboard}>
      {/* ── Hero Section ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.greeting}>{greeting} 👋</span>
          <h2 className={styles.userName}>{user?.name || 'User'}</h2>
          <p className={styles.subtitle}>
            Here's an overview of your activity and quick links to your workspace.
          </p>
        </div>
        <div className={styles.heroGlow} />
      </section>

      {/* ── Stats Grid ── */}
      <section className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statPrimary}`}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.completedTodos}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
          <div className={styles.statProgress}>
            <div
              className={styles.statProgressBar}
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <span className={styles.statPercent}>{stats.completionRate}%</span>
        </div>

        <div className={`${styles.statCard} ${styles.statWarning}`}>
          <div className={styles.statIcon}>⏳</div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.pendingTodos}</span>
            <span className={styles.statLabel}>Pending Todos</span>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statSecondary}`}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.totalPosts}</span>
            <span className={styles.statLabel}>Posts Written</span>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statTertiary}`}>
          <div className={styles.statIcon}>📸</div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{stats.totalAlbums}</span>
            <span className={styles.statLabel}>Photo Albums</span>
          </div>
        </div>
      </section>

      {/* ── Quick Access ── */}
      <section className={styles.quickAccess}>
        <h3 className={styles.sectionTitle}>Quick Access</h3>
        <div className={styles.tilesGrid}>
          <button className={styles.tile} onClick={() => navigate('/home/todos')}>
            <div className={`${styles.tileIcon} ${styles.tileIconTodos}`}>✅</div>
            <div className={styles.tileInfo}>
              <span className={styles.tileTitle}>My Todos</span>
              <span className={styles.tileDesc}>Manage your tasks & track progress</span>
            </div>
            <span className={styles.tileArrow}>→</span>
          </button>

          <button className={styles.tile} onClick={() => navigate('/home/posts')}>
            <div className={`${styles.tileIcon} ${styles.tileIconPosts}`}>📝</div>
            <div className={styles.tileInfo}>
              <span className={styles.tileTitle}>My Posts</span>
              <span className={styles.tileDesc}>Write & manage your articles</span>
            </div>
            <span className={styles.tileArrow}>→</span>
          </button>

          <button className={styles.tile} onClick={() => navigate('/home/albums')}>
            <div className={`${styles.tileIcon} ${styles.tileIconAlbums}`}>📸</div>
            <div className={styles.tileInfo}>
              <span className={styles.tileTitle}>My Albums</span>
              <span className={styles.tileDesc}>Browse & organize your photos</span>
            </div>
            <span className={styles.tileArrow}>→</span>
          </button>
        </div>
      </section>

      {/* ── Recent Activity ── */}
      <section className={styles.recentSection}>
        <h3 className={styles.sectionTitle}>Recent Todos</h3>
        {recentTodos.length === 0 ? (
          <p className={styles.emptyMessage}>No recent activity yet.</p>
        ) : (
          <ul className={styles.recentList}>
            {recentTodos.map((todo) => (
              <li
                key={todo.id}
                className={`${styles.recentItem} ${todo.completed ? styles.recentCompleted : ''}`}
              >
                <span className={styles.recentStatus}>
                  {todo.completed ? '✔' : '○'}
                </span>
                <span className={styles.recentTitle}>{todo.title}</span>
                <span className={styles.recentId}>#{todo.id}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
