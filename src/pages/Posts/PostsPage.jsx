import { useState, useReducer, useCallback, useMemo, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCache } from '../../hooks/useCache';
import { useSearchParamsState } from '../../hooks/useSearchParamsState';
import { getPostsByUserId, createPost, updatePost, deletePost } from '../../api/postsApi';
import { postsReducer, postsInitialState, POSTS_ACTIONS } from '../../reducers/postsReducer';
import { filterByQuery } from '../../utils/helpers';
import SearchBar from '../../components/UI/SearchBar';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import styles from './Posts.module.css';

const PostsPage = () => {
  const { user } = useAuth();
  const cache = useCache();
  const navigate = useNavigate();
  const { postId } = useParams();
  const [posts, dispatch] = useReducer(postsReducer, postsInitialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [editingPostId, setEditingPostId] = useState(null);
  const [editFields, setEditFields] = useState({ title: '', body: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { params, setParam } = useSearchParamsState({ search: '' });

  const selectedPostId = postId ? Number(postId) : null;

  // ── Fetch posts ──
  const fetchPosts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const cacheKey = `/posts?userId=${user.id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      dispatch({ type: POSTS_ACTIONS.SET, payload: cached });
      setLoading(false);
      return;
    }
    try {
      const data = await getPostsByUserId(user.id);
      dispatch({ type: POSTS_ACTIONS.SET, payload: data });
      cache.set(cacheKey, data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, cache]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // ── Add post ──
  const handleAddPost = useCallback(async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.body.trim()) return;
    try {
      const created = await createPost({ userId: user.id, title: newPost.title.trim(), body: newPost.body.trim() });
      dispatch({ type: POSTS_ACTIONS.ADD, payload: created });
      cache.invalidatePattern('/posts');
      setNewPost({ title: '', body: '' });
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
    }
  }, [newPost, user, cache]);

  // ── Edit post ──
  const startEditPost = useCallback((post) => {
    setEditingPostId(post.id);
    setEditFields({ title: post.title, body: post.body });
  }, []);

  const saveEditPost = useCallback(async () => {
    if (!editFields.title.trim()) return;
    try {
      await updatePost(editingPostId, { title: editFields.title.trim(), body: editFields.body.trim() });
      dispatch({ type: POSTS_ACTIONS.UPDATE, payload: { id: editingPostId, updates: editFields } });
      cache.invalidatePattern('/posts');
      setEditingPostId(null);
    } catch (err) {
      setError(err.message);
    }
  }, [editingPostId, editFields, cache]);

  // ── Delete post ──
  const confirmDeletePost = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deletePost(deleteTarget);
      dispatch({ type: POSTS_ACTIONS.DELETE, payload: deleteTarget });
      cache.invalidatePattern('/posts');
      setDeleteTarget(null);
      if (selectedPostId === deleteTarget) navigate('/home/posts', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }, [deleteTarget, selectedPostId, navigate, cache]);

  // ── Filtered list (memoized) ──
  const filteredPosts = useMemo(() => {
    if (!params.search) return posts;
    return filterByQuery(posts, params.search, ['id', 'title']);
  }, [posts, params.search]);

  if (loading) return <Loader message="Loading posts..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchPosts} />;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h2 className={styles.title}>My Posts</h2>
        <span className={styles.count}>{posts.length} posts</span>
        <button className={styles.newBtn} onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ New Post'}
        </button>
      </div>

      {/* ── Add Form ── */}
      {showAddForm && (
        <form className={styles.addForm} onSubmit={handleAddPost}>
          <input type="text" value={newPost.title} onChange={(e) => setNewPost(p => ({...p, title: e.target.value}))} placeholder="Post title..." className={styles.formInput} />
          <textarea value={newPost.body} onChange={(e) => setNewPost(p => ({...p, body: e.target.value}))} placeholder="Post content..." className={styles.formTextarea} rows={3} />
          <button type="submit" className={styles.submitBtn} disabled={!newPost.title.trim() || !newPost.body.trim()}>Publish</button>
        </form>
      )}

      <SearchBar value={params.search} onChange={(v) => setParam('search', v)} placeholder="Search by ID or title..." />

      <div className={styles.layout}>
        {/* ── Post List ── */}
        <ul className={styles.list}>
          {filteredPosts.map((post) => (
            <li
              key={post.id}
              className={`${styles.postItem} ${selectedPostId === post.id ? styles.selected : ''}`}
              onClick={() => navigate(`/home/posts/${post.id}`)}
            >
              <span className={styles.postId}>#{post.id}</span>
              <span className={styles.postTitle}>{post.title}</span>
              <div className={styles.postActions} onClick={(e) => e.stopPropagation()}>
                <button className={styles.editBtn} onClick={() => startEditPost(post)}>✏️</button>
                <button className={styles.deleteBtn} onClick={() => setDeleteTarget(post.id)}>🗑️</button>
              </div>
            </li>
          ))}
          {filteredPosts.length === 0 && <li className={styles.empty}>No posts found</li>}
        </ul>

        {/* ── Post Detail (nested outlet) ── */}
        <div className={styles.detail}>
          <Outlet context={{ posts }} />
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editingPostId && (
        <div className={styles.editOverlay} onClick={() => setEditingPostId(null)}>
          <div className={styles.editModal} onClick={(e) => e.stopPropagation()}>
            <h3>Edit Post</h3>
            <input type="text" value={editFields.title} onChange={(e) => setEditFields(f => ({...f, title: e.target.value}))} className={styles.formInput} />
            <textarea value={editFields.body} onChange={(e) => setEditFields(f => ({...f, body: e.target.value}))} className={styles.formTextarea} rows={4} />
            <div className={styles.editActions}>
              <button onClick={() => setEditingPostId(null)} className={styles.cancelBtn}>Cancel</button>
              <button onClick={saveEditPost} className={styles.submitBtn}>Save</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={deleteTarget !== null} onConfirm={confirmDeletePost} onCancel={() => setDeleteTarget(null)} message="Delete this post and all its comments?" />
    </div>
  );
};

export default PostsPage;
