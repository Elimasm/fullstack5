import { useState, useReducer, useCallback, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCache } from '../../hooks/useCache';
import { useSearchParamsState } from '../../hooks/useSearchParamsState';
import { getTodosByUserId, createTodo, updateTodo, deleteTodo } from '../../api/todosApi';
import { todosReducer, todosInitialState, TODOS_ACTIONS } from '../../reducers/todosReducer';
import { sortByKey, filterByQuery } from '../../utils/helpers';
import { SORT_OPTIONS } from '../../utils/constants';
import SearchBar from '../../components/UI/SearchBar';
import SortSelect from '../../components/UI/SortSelect';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import styles from '../../CSS/Todos.module.css';
import { useEffect } from 'react';

const TodosPage = () => {
  const { user } = useAuth();
  const cache = useCache();
  const [todos, dispatch] = useReducer(todosReducer, todosInitialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { params, setParam } = useSearchParamsState({ search: '', sort: 'id' });

  // ── Fetch todos ──
  const fetchTodos = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const cacheKey = `/todos?userId=${user.id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      dispatch({ type: TODOS_ACTIONS.SET, payload: cached });
      setLoading(false);
      return;
    }

    try {
      const data = await getTodosByUserId(user.id);
      dispatch({ type: TODOS_ACTIONS.SET, payload: data });
      cache.set(cacheKey, data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, cache]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // ── Add todo ──
  const handleAddTodo = useCallback(async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const created = await createTodo({
        userId: user.id,
        title: newTitle.trim(),
        completed: false,
      });
      dispatch({ type: TODOS_ACTIONS.ADD, payload: created });
      cache.invalidatePattern('/todos');
      setNewTitle('');
    } catch (err) {
      setError(err.message);
    }
  }, [newTitle, user, cache]);

  // ── Toggle completion ──
  const handleToggle = useCallback(async (todo) => {
    try {
      await updateTodo(todo.id, { completed: !todo.completed });
      dispatch({ type: TODOS_ACTIONS.TOGGLE, payload: todo.id });
      cache.invalidatePattern('/todos');
    } catch (err) {
      setError(err.message);
    }
  }, [cache]);

  // ── Start editing ──
  const startEdit = useCallback((todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  }, []);

  // ── Save edit ──
  const saveEdit = useCallback(async (id) => {
    if (!editTitle.trim()) return;
    try {
      await updateTodo(id, { title: editTitle.trim() });
      dispatch({ type: TODOS_ACTIONS.UPDATE, payload: { id, updates: { title: editTitle.trim() } } });
      cache.invalidatePattern('/todos');
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  }, [editTitle, cache]);

  // ── Delete todo ──
  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteTodo(deleteTarget);
      dispatch({ type: TODOS_ACTIONS.DELETE, payload: deleteTarget });
      cache.invalidatePattern('/todos');
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message);
    }
  }, [deleteTarget, cache]);

  // ── Filtered & sorted list (memoized) ──
  const processedTodos = useMemo(() => {
    let result = [...todos];
    if (params.search) {
      result = filterByQuery(result, params.search, ['id', 'title', 'completed']);
    }
    if (params.sort) {
      result = sortByKey(result, params.sort);
    }
    return result;
  }, [todos, params.search, params.sort]);

  if (loading) return <Loader message="Loading todos..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchTodos} />;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h2 className={styles.title}>My Todos</h2>
        <span className={styles.count}>{todos.length} total</span>
      </div>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        <SearchBar
          value={params.search}
          onChange={(v) => setParam('search', v)}
          placeholder="Search by ID, title, or status..."
        />
        <SortSelect
          value={params.sort}
          onChange={(v) => setParam('sort', v)}
          options={SORT_OPTIONS.TODOS}
        />
      </div>

      {/* ── Add Form ── */}
      <form className={styles.addForm} onSubmit={handleAddTodo}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new todo..."
          className={styles.addInput}
        />
        <button type="submit" className={styles.addBtn} disabled={!newTitle.trim()}>
          + Add
        </button>
      </form>

      {/* ── List ── */}
      <ul className={styles.list}>
        {processedTodos.map((todo) => (
          <li key={todo.id} className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo)}
              className={styles.checkbox}
            />

            <span className={styles.itemId}>#{todo.id}</span>

            {editingId === todo.id ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                onBlur={() => saveEdit(todo.id)}
                className={styles.editInput}
                autoFocus
              />
            ) : (
              <span
                className={styles.itemTitle}
                onDoubleClick={() => startEdit(todo)}
              >
                {todo.title}
              </span>
            )}

            <div className={styles.itemActions}>
              {editingId !== todo.id && (
                <button className={styles.editBtn} onClick={() => startEdit(todo)} title="Edit">
                  ✏️
                </button>
              )}
              <button className={styles.deleteBtn} onClick={() => setDeleteTarget(todo.id)} title="Delete">
                🗑️
              </button>
            </div>
          </li>
        ))}
        {processedTodos.length === 0 && (
          <li className={styles.empty}>No todos found</li>
        )}
      </ul>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        message="Are you sure you want to delete this todo?"
      />
    </div>
  );
};

export default TodosPage;
