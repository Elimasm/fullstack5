import axiosInstance from './axiosInstance';

/**
 * Fetch all users from the server.
 */
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/users');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};

/**
 * Find a user by username.
 * @param {string} username
 */
export const getUserByUsername = async (username) => {
  try {
    const response = await axiosInstance.get('/users', {
      params: { username },
    });
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    throw new Error(`Failed to find user: ${error.message}`);
  }
};

/**
 * Get a user by ID.
 * @param {number} id
 */
export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};

/**
 * Create a new user (registration).
 * @param {object} userData
 */
export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

/**
 * Update an existing user.
 * @param {number} id
 * @param {object} updates
 */
export const updateUser = async (id, updates) => {
  try {
    const response = await axiosInstance.patch(`/users/${id}`, updates);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};
