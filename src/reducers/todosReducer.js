// ── Todos Reducer ──
export const TODOS_ACTIONS = {
  SET: 'SET_TODOS',
  ADD: 'ADD_TODO',
  UPDATE: 'UPDATE_TODO',
  DELETE: 'DELETE_TODO',
  TOGGLE: 'TOGGLE_TODO',
};

export const todosInitialState = [];

export const todosReducer = (state, action) => {
  switch (action.type) {
    case TODOS_ACTIONS.SET:
      return action.payload;
    case TODOS_ACTIONS.ADD:
      return [...state, action.payload];
    case TODOS_ACTIONS.UPDATE:
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, ...action.payload.updates }
          : todo
      );
    case TODOS_ACTIONS.TOGGLE:
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    case TODOS_ACTIONS.DELETE:
      return state.filter((todo) => todo.id !== action.payload);
    default:
      return state;
  }
};
