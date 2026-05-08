import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCache } from '../../hooks/useCache';
import { usePagination } from '../../hooks/usePagination';
import { getPhotosByAlbumId, createPhoto, updatePhoto, deletePhoto } from '../../api/photosApi';
import { getAlbumById } from '../../api/albumsApi';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import Pagination from '../../components/UI/Pagination';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import styles from '../../CSS/Albums.module.css';
import { PHOTOS_PER_PAGE } from '../../utils/constants';

const AlbumPhotos = () => {
  const { albumId } = useParams();
  const { user } = useAuth();
  const cache = useCache();
  const navigate = useNavigate();
  const numericAlbumId = Number(albumId);

  const [album, setAlbum] = useState(null);
  const [albumLoading, setAlbumLoading] = useState(true);
  const [albumError, setAlbumError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ title: '', url: '' });
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [editFields, setEditFields] = useState({ title: '', url: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // ── Fetch album info & verify ownership ──
  useEffect(() => {
    const loadAlbum = async () => {
      setAlbumLoading(true);
      try {
        const data = await getAlbumById(numericAlbumId);
        if (data.userId !== user?.id) {
          setAlbumError('Access denied. This album belongs to another user.');
          setAlbumLoading(false);
          return;
        }
        setAlbum(data);
      } catch (err) {
        setAlbumError(err.message);
      } finally {
        setAlbumLoading(false);
      }
    };
    loadAlbum();
  }, [numericAlbumId, user]);

  // ── Progressive photo loading ──
  const fetchPage = useCallback(async (page, limit) => {
    const result = await getPhotosByAlbumId(numericAlbumId, page, limit);
    setTotalCount(result.totalCount);
    return result;
  }, [numericAlbumId]);

  const { items: photos, hasMore, loading: photosLoading, error: photosError, loadMore, setItems: setPhotos, reset } = usePagination(fetchPage, PHOTOS_PER_PAGE);

  // Load first page
  useEffect(() => {
    if (album) {
      reset();
      loadMore();
    }
  }, [album]);

  // ── Add photo ──
  const handleAddPhoto = useCallback(async (e) => {
    e.preventDefault();
    if (!newPhoto.title.trim() || !newPhoto.url.trim()) return;
    try {
      const photoId = Math.floor(Math.random() * 200) + 10;
      const created = await createPhoto({
        albumId: numericAlbumId,
        title: newPhoto.title.trim(),
        url: newPhoto.url.trim() || `https://picsum.photos/id/${photoId}/600/600`,
        thumbnailUrl: newPhoto.url.trim() || `https://picsum.photos/id/${photoId}/150/150`,
      });
      setPhotos((prev) => [...prev, created]);
      cache.invalidatePattern('/photos');
      setNewPhoto({ title: '', url: '' });
      setShowAdd(false);
    } catch (err) {
      setAlbumError(err.message);
    }
  }, [newPhoto, numericAlbumId, cache, setPhotos]);

  // ── Edit photo ──
  const startEditPhoto = useCallback((photo) => {
    setEditingPhotoId(photo.id);
    setEditFields({ title: photo.title, url: photo.url });
  }, []);

  const saveEditPhoto = useCallback(async () => {
    try {
      await updatePhoto(editingPhotoId, { title: editFields.title.trim(), url: editFields.url.trim() });
      setPhotos((prev) => prev.map((p) => p.id === editingPhotoId ? { ...p, ...editFields } : p));
      cache.invalidatePattern('/photos');
      setEditingPhotoId(null);
    } catch (err) {
      setAlbumError(err.message);
    }
  }, [editingPhotoId, editFields, cache, setPhotos]);

  // ── Delete photo ──
  const confirmDeletePhoto = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deletePhoto(deleteTarget);
      setPhotos((prev) => prev.filter((p) => p.id !== deleteTarget));
      cache.invalidatePattern('/photos');
      setDeleteTarget(null);
    } catch (err) {
      setAlbumError(err.message);
    }
  }, [deleteTarget, cache, setPhotos]);

  if (albumLoading) return <Loader message="Loading album..." />;
  if (albumError) return <ErrorMessage message={albumError} />;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <button className={styles.backBtn} onClick={() => navigate('/home/albums')}>← Back</button>
        <h2 className={styles.title}>{album?.title}</h2>
        <button className={styles.newBtn} onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : '+ Add Photo'}
        </button>
      </div>

      {showAdd && (
        <form className={styles.addForm} onSubmit={handleAddPhoto}>
          <input type="text" value={newPhoto.title} onChange={(e) => setNewPhoto(p => ({...p, title: e.target.value}))} placeholder="Photo title..." className={styles.formInput} />
          <input type="text" value={newPhoto.url} onChange={(e) => setNewPhoto(p => ({...p, url: e.target.value}))} placeholder="Image URL (leave empty for random)" className={styles.formInput} />
          <button type="submit" className={styles.submitBtn} disabled={!newPhoto.title.trim()}>Add Photo</button>
        </form>
      )}

      <div className={styles.photosGrid}>
        {photos.map((photo) => (
          <div key={photo.id} className={styles.photoCard}>
            <div className={styles.photoWrapper}>
              <img src={photo.thumbnailUrl} alt={photo.title} loading="lazy" className={styles.photoImg} />
            </div>
            <div className={styles.photoInfo}>
              <span className={styles.photoTitle}>{photo.title}</span>
              <div className={styles.photoActions}>
                <button onClick={() => startEditPhoto(photo)} className={styles.editBtn}>✏️</button>
                <button onClick={() => setDeleteTarget(photo.id)} className={styles.deleteBtn}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination hasMore={hasMore} loading={photosLoading} onLoadMore={loadMore} currentCount={photos.length} totalCount={totalCount} />

      {photosError && <ErrorMessage message={photosError} />}

      {/* Edit overlay */}
      {editingPhotoId && (
        <div className={styles.editOverlay} onClick={() => setEditingPhotoId(null)}>
          <div className={styles.editModal} onClick={(e) => e.stopPropagation()}>
            <h3>Edit Photo</h3>
            <input type="text" value={editFields.title} onChange={(e) => setEditFields(f => ({...f, title: e.target.value}))} className={styles.formInput} placeholder="Title" />
            <input type="text" value={editFields.url} onChange={(e) => setEditFields(f => ({...f, url: e.target.value}))} className={styles.formInput} placeholder="URL" />
            <div className={styles.editActions}>
              <button onClick={() => setEditingPhotoId(null)} className={styles.cancelBtn}>Cancel</button>
              <button onClick={saveEditPhoto} className={styles.submitBtn}>Save</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={deleteTarget !== null} onConfirm={confirmDeletePhoto} onCancel={() => setDeleteTarget(null)} message="Delete this photo?" />
    </div>
  );
};

export default AlbumPhotos;
