// ── Posts Reducer ──
export const POSTS_ACTIONS = {
  SET: 'SET_POSTS',
  ADD: 'ADD_POST',
  UPDATE: 'UPDATE_POST',
  DELETE: 'DELETE_POST',
};

export const postsInitialState = [];

export const postsReducer = (state, action) => {
  switch (action.type) {
    case POSTS_ACTIONS.SET:
      return action.payload;
    case POSTS_ACTIONS.ADD:
      return [...state, action.payload];
    case POSTS_ACTIONS.UPDATE:
      return state.map((post) =>
        post.id === action.payload.id
          ? { ...post, ...action.payload.updates }
          : post
      );
    case POSTS_ACTIONS.DELETE:
      return state.filter((post) => post.id !== action.payload);
    default:
      return state;
  }
};
