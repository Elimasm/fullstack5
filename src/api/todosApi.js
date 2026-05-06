import axiosInstance from './axiosInstance';

/**
 * Fetch todos for a specific user.
 * @param {number} userId
 */
export const getTodosByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get('/todos', {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch todos: ${error.message}`);
  }
};

/**
 * Create a new todo.
 * @param {object} todoData - { userId, title, completed }
 */
export const createTodo = async (todoData) => {
  try {
    const response = await axiosInstance.post('/todos', todoData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create todo: ${error.message}`);
  }
};

/**
 * Update an existing todo.
 * @param {number} id
 * @param {object} updates
 */
export const updateTodo = async (id, updates) => {
  try {
    const response = await axiosInstance.patch(`/todos/${id}`, updates);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update todo: ${error.message}`);
  }
};

/**
 * Delete a todo by ID.
 * @param {number} id
 */
export const deleteTodo = async (id) => {
  try {
    await axiosInstance.delete(`/todos/${id}`);
    return id;
  } catch (error) {
    throw new Error(`Failed to delete todo: ${error.message}`);
  }
};
