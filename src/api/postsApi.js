import axiosInstance from './axiosInstance';

/**
 * Fetch posts for a specific user.
 * @param {number} userId
 */
export const getPostsByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get('/posts', {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }
};

/**
 * Get a single post by ID.
 * @param {number} id
 */
export const getPostById = async (id) => {
  try {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch post: ${error.message}`);
  }
};

/**
 * Create a new post.
 * @param {object} postData - { userId, title, body }
 */
export const createPost = async (postData) => {
  try {
    const response = await axiosInstance.post('/posts', postData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create post: ${error.message}`);
  }
};

/**
 * Update an existing post.
 * @param {number} id
 * @param {object} updates
 */
export const updatePost = async (id, updates) => {
  try {
    const response = await axiosInstance.patch(`/posts/${id}`, updates);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update post: ${error.message}`);
  }
};

/**
 * Delete a post by ID.
 * @param {number} id
 */
export const deletePost = async (id) => {
  try {
    await axiosInstance.delete(`/posts/${id}`);
    return id;
  } catch (error) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }
};
