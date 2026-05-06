import { useState, useCallback, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCache } from '../../hooks/useCache';
import { getCommentsByPostId, createComment, updateComment, deleteComment } from '../../api/commentsApi';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import styles from './Posts.module.css';

const PostDetail = () => {
  const { postId } = useParams();
  const { posts } = useOutletContext();
  const { user } = useAuth();
  const cache = useCache();
  const numericId = Number(postId);

  const post = posts?.find((p) => p.id === numericId);

  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentBody, setEditCommentBody] = useState('');
  const [deleteCommentTarget, setDeleteCommentTarget] = useState(null);

  // ── Fetch comments ──
  const fetchComments = useCallback(async () => {
    setCommentsLoading(true);
    setCommentsError(null);
    const cacheKey = `/comments?postId=${numericId}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      setComments(cached);
      setCommentsLoading(false);
      return;
    }
    try {
      const data = await getCommentsByPostId(numericId);
      setComments(data);
      cache.set(cacheKey, data);
    } catch (err) {
      setCommentsError(err.message);
    } finally {
      setCommentsLoading(false);
    }
  }, [numericId, cache]);

  const handleShowComments = useCallback(() => {
    setShowComments(true);
    fetchComments();
  }, [fetchComments]);

  // Reset when post changes
  useEffect(() => {
    setShowComments(false);
    setComments([]);
  }, [numericId]);

  // ── Add comment ──
  const handleAddComment = useCallback(async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const created = await createComment({
        postId: numericId,
        name: `Comment by ${user.name}`,
        email: user.email,
        body: newComment.trim(),
      });
      setComments((prev) => [...prev, created]);
      cache.invalidatePattern(`/comments?postId=${numericId}`);
      setNewComment('');
    } catch (err) {
      setCommentsError(err.message);
    }
  }, [newComment, numericId, user, cache]);

  // ── Edit comment ──
  const startEditComment = useCallback((comment) => {
    setEditingCommentId(comment.id);
    setEditCommentBody(comment.body);
  }, []);

  const saveEditComment = useCallback(async () => {
    if (!editCommentBody.trim()) return;
    try {
      await updateComment(editingCommentId, { body: editCommentBody.trim() });
      setComments((prev) =>
        prev.map((c) => c.id === editingCommentId ? { ...c, body: editCommentBody.trim() } : c)
      );
      cache.invalidatePattern(`/comments?postId=${numericId}`);
      setEditingCommentId(null);
    } catch (err) {
      setCommentsError(err.message);
    }
  }, [editingCommentId, editCommentBody, numericId, cache]);

  // ── Delete comment ──
  const confirmDeleteComment = useCallback(async () => {
    if (!deleteCommentTarget) return;
    try {
      await deleteComment(deleteCommentTarget);
      setComments((prev) => prev.filter((c) => c.id !== deleteCommentTarget));
      cache.invalidatePattern(`/comments?postId=${numericId}`);
      setDeleteCommentTarget(null);
    } catch (err) {
      setCommentsError(err.message);
    }
  }, [deleteCommentTarget, numericId, cache]);

  // Ownership check for comments
  const isCommentOwner = useCallback((comment) => {
    return comment.email === user?.email;
  }, [user]);

  if (!post) {
    return <div className={styles.detailPlaceholder}>Select a post to view its content</div>;
  }

  return (
    <div className={styles.detailContent}>
      <div className={styles.detailHeader}>
        <span className={styles.detailId}>Post #{post.id}</span>
        <h3 className={styles.detailTitle}>{post.title}</h3>
      </div>
      <p className={styles.detailBody}>{post.body}</p>

      {/* ── Comments Section ── */}
      {!showComments ? (
        <button className={styles.showCommentsBtn} onClick={handleShowComments}>
          💬 Show Comments
        </button>
      ) : (
        <div className={styles.commentsSection}>
          <h4 className={styles.commentsTitle}>Comments ({comments.length})</h4>

          {commentsLoading && <Loader message="Loading comments..." />}
          {commentsError && <ErrorMessage message={commentsError} onRetry={fetchComments} />}

          <ul className={styles.commentsList}>
            {comments.map((comment) => (
              <li key={comment.id} className={`${styles.commentItem} ${isCommentOwner(comment) ? styles.ownComment : ''}`}>
                <div className={styles.commentHeader}>
                  <strong className={styles.commentAuthor}>{comment.email}</strong>
                  {isCommentOwner(comment) && <span className={styles.ownerBadge}>You</span>}
                </div>

                {editingCommentId === comment.id ? (
                  <div className={styles.editCommentForm}>
                    <textarea
                      value={editCommentBody}
                      onChange={(e) => setEditCommentBody(e.target.value)}
                      className={styles.formTextarea}
                      rows={2}
                    />
                    <div className={styles.editActions}>
                      <button onClick={() => setEditingCommentId(null)} className={styles.cancelBtn}>Cancel</button>
                      <button onClick={saveEditComment} className={styles.submitBtn}>Save</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className={styles.commentBody}>{comment.body}</p>
                    {isCommentOwner(comment) && (
                      <div className={styles.commentActions}>
                        <button onClick={() => startEditComment(comment)} className={styles.editBtn}>✏️</button>
                        <button onClick={() => setDeleteCommentTarget(comment.id)} className={styles.deleteBtn}>🗑️</button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>

          {/* ── Add Comment Form ── */}
          <form className={styles.addCommentForm} onSubmit={handleAddComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className={styles.formTextarea}
              rows={2}
            />
            <button type="submit" className={styles.submitBtn} disabled={!newComment.trim()}>
              Post Comment
            </button>
          </form>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteCommentTarget !== null}
        onConfirm={confirmDeleteComment}
        onCancel={() => setDeleteCommentTarget(null)}
        message="Delete this comment?"
      />
    </div>
  );
};

export default PostDetail;
