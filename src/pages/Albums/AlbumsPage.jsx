import { useState, useReducer, useCallback, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCache } from '../../hooks/useCache';
import { useSearchParamsState } from '../../hooks/useSearchParamsState';
import { getAlbumsByUserId, createAlbum } from '../../api/albumsApi';
import { albumsReducer, albumsInitialState, ALBUMS_ACTIONS } from '../../reducers/albumsReducer';
import { filterByQuery } from '../../utils/helpers';
import SearchBar from '../../components/UI/SearchBar';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import styles from '../../CSS/Albums.module.css';

const AlbumsPage = () => {
  const { user } = useAuth();
  const cache = useCache();
  const [albums, dispatch] = useReducer(albumsReducer, albumsInitialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const { params, setParam } = useSearchParamsState({ search: '' });

  const fetchAlbums = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const cacheKey = `/albums?userId=${user.id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      dispatch({ type: ALBUMS_ACTIONS.SET, payload: cached });
      setLoading(false);
      return;
    }
    try {
      const data = await getAlbumsByUserId(user.id);
      dispatch({ type: ALBUMS_ACTIONS.SET, payload: data });
      cache.set(cacheKey, data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, cache]);

  useEffect(() => { fetchAlbums(); }, [fetchAlbums]);

  const handleAdd = useCallback(async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const created = await createAlbum({ userId: user.id, title: newTitle.trim() });
      dispatch({ type: ALBUMS_ACTIONS.ADD, payload: created });
      cache.invalidatePattern('/albums');
      setNewTitle('');
      setShowAdd(false);
    } catch (err) {
      setError(err.message);
    }
  }, [newTitle, user, cache]);

  const filteredAlbums = useMemo(() => {
    if (!params.search) return albums;
    return filterByQuery(albums, params.search, ['id', 'title']);
  }, [albums, params.search]);

  if (loading) return <Loader message="Loading albums..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAlbums} />;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h2 className={styles.title}>My Albums</h2>
        <span className={styles.count}>{albums.length} albums</span>
        <button className={styles.newBtn} onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : '+ New Album'}
        </button>
      </div>

      {showAdd && (
        <form className={styles.addForm} onSubmit={handleAdd}>
          <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Album title..." className={styles.formInput} />
          <button type="submit" className={styles.submitBtn} disabled={!newTitle.trim()}>Create</button>
        </form>
      )}

      <SearchBar value={params.search} onChange={(v) => setParam('search', v)} placeholder="Search by ID or title..." />

      <div className={styles.grid}>
        {filteredAlbums.map((album) => (
          <Link key={album.id} to={`/home/albums/${album.id}/photos`} className={styles.albumCard}>
            <div className={styles.albumCover}>
              <span className={styles.albumIcon}>📷</span>
            </div>
            <div className={styles.albumInfo}>
              <span className={styles.albumId}>#{album.id}</span>
              <h3 className={styles.albumTitle}>{album.title}</h3>
            </div>
          </Link>
        ))}
        {filteredAlbums.length === 0 && <p className={styles.empty}>No albums found</p>}
      </div>
    </div>
  );
};

export default AlbumsPage;
