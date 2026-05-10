// ── Auth Reducer ──

// INSIDE HERE - there is the logics of changing the states of the user which is : if he is logged in or not, and if he is logged in, who is he.
// in every page there is a component called useAuth.jsx which is a hook that allows us to access the state and the functions to update the state.
// useAuth.jsx is connected to the AuthContext.jsx, we able to reach AuthContext from anywhere becuase of the useContext() function.

// Action types
export const AUTH_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REGISTER: 'REGISTER',
  RESTORE_SESSION: 'RESTORE_SESSION',
};

export const authInitialState = {
  user: null,
  isAuthenticated: false,
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN:
    case AUTH_ACTIONS.REGISTER:
    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};
