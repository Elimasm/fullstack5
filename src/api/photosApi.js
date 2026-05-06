import axiosInstance from './axiosInstance';

/**
 * Fetch photos for a specific album with pagination.
 * @param {number} albumId
 * @param {number} page - 1-indexed page number.
 * @param {number} limit - Photos per page.
 */
export const getPhotosByAlbumId = async (albumId, page = 1, limit = 12) => {
  try {
    const response = await axiosInstance.get('/photos', {
      params: {
        albumId,
        _page: page,
        _limit: limit,
      },
    });
    const totalCount = parseInt(response.headers['x-total-count'] || '0', 10);
    return {
      data: response.data,
      totalCount,
      hasMore: page * limit < totalCount,
    };
  } catch (error) {
    throw new Error(`Failed to fetch photos: ${error.message}`);
  }
};

/**
 * Get a single photo by ID.
 * @param {number} id
 */
export const getPhotoById = async (id) => {
  try {
    const response = await axiosInstance.get(`/photos/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch photo: ${error.message}`);
  }
};

/**
 * Create a new photo.
 * @param {object} photoData - { albumId, title, url, thumbnailUrl }
 */
export const createPhoto = async (photoData) => {
  try {
    const response = await axiosInstance.post('/photos', photoData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create photo: ${error.message}`);
  }
};

/**
 * Update an existing photo.
 * @param {number} id
 * @param {object} updates
 */
export const updatePhoto = async (id, updates) => {
  try {
    const response = await axiosInstance.patch(`/photos/${id}`, updates);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update photo: ${error.message}`);
  }
};

/**
 * Delete a photo by ID.
 * @param {number} id
 */
export const deletePhoto = async (id) => {
  try {
    await axiosInstance.delete(`/photos/${id}`);
    return id;
  } catch (error) {
    throw new Error(`Failed to delete photo: ${error.message}`);
  }
};
