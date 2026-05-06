// ── Albums Reducer ──
export const ALBUMS_ACTIONS = {
  SET: 'SET_ALBUMS',
  ADD: 'ADD_ALBUM',
  UPDATE: 'UPDATE_ALBUM',
  DELETE: 'DELETE_ALBUM',
};

export const albumsInitialState = [];

export const albumsReducer = (state, action) => {
  switch (action.type) {
    case ALBUMS_ACTIONS.SET:
      return action.payload;
    case ALBUMS_ACTIONS.ADD:
      return [...state, action.payload];
    case ALBUMS_ACTIONS.UPDATE:
      return state.map((album) =>
        album.id === action.payload.id
          ? { ...album, ...action.payload.updates }
          : album
      );
    case ALBUMS_ACTIONS.DELETE:
      return state.filter((album) => album.id !== action.payload);
    default:
      return state;
  }
};
