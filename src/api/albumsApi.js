import axiosInstance from './axiosInstance';

/**
 * Fetch albums for a specific user.
 * @param {number} userId
 */
export const getAlbumsByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get('/albums', {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch albums: ${error.message}`);
  }
};

/**
 * Get a single album by ID.
 * @param {number} id
 */
export const getAlbumById = async (id) => {
  try {
    const response = await axiosInstance.get(`/albums/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch album: ${error.message}`);
  }
};

/**
 * Create a new album.
 * @param {object} albumData - { userId, title }
 */
export const createAlbum = async (albumData) => {
  try {
    const response = await axiosInstance.post('/albums', albumData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create album: ${error.message}`);
  }
};

/**
 * Update an existing album.
 * @param {number} id
 * @param {object} updates
 */
export const updateAlbum = async (id, updates) => {
  try {
    const response = await axiosInstance.patch(`/albums/${id}`, updates);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update album: ${error.message}`);
  }
};

/**
 * Delete an album by ID.
 * @param {number} id
 */
export const deleteAlbum = async (id) => {
  try {
    await axiosInstance.delete(`/albums/${id}`);
    return id;
  } catch (error) {
    throw new Error(`Failed to delete album: ${error.message}`);
  }
};
