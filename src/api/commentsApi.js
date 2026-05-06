import axiosInstance from './axiosInstance';

/**
 * Fetch comments for a specific post.
 * @param {number} postId
 */
export const getCommentsByPostId = async (postId) => {
  try {
    const response = await axiosInstance.get('/comments', {
      params: { postId },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch comments: ${error.message}`);
  }
};

/**
 * Create a new comment.
 * @param {object} commentData - { postId, name, email, body }
 */
export const createComment = async (commentData) => {
  try {
    const response = await axiosInstance.post('/comments', commentData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create comment: ${error.message}`);
  }
};

/**
 * Update an existing comment (only if owned by user).
 * @param {number} id
 * @param {object} updates
 */
export const updateComment = async (id, updates) => {
  try {
    const response = await axiosInstance.patch(`/comments/${id}`, updates);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update comment: ${error.message}`);
  }
};

/**
 * Delete a comment by ID (only if owned by user).
 * @param {number} id
 */
export const deleteComment = async (id) => {
  try {
    await axiosInstance.delete(`/comments/${id}`);
    return id;
  } catch (error) {
    throw new Error(`Failed to delete comment: ${error.message}`);
  }
};
