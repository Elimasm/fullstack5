import { createContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { authReducer, authInitialState, AUTH_ACTIONS } from '../reducers/authReducer';
import { getUserByUsername, createUser } from '../api/usersApi';
import { LS_KEYS } from '../utils/constants';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  // ── Restore session from localStorage on mount ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEYS.CURRENT_USER);
      if (stored) {
        const user = JSON.parse(stored);
        dispatch({ type: AUTH_ACTIONS.RESTORE_SESSION, payload: user });
      }
    } catch {
      localStorage.removeItem(LS_KEYS.CURRENT_USER);
    }
  }, []);

  // ── Sync state changes to localStorage ──
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      localStorage.setItem(LS_KEYS.CURRENT_USER, JSON.stringify(state.user));
    }
  }, [state.user, state.isAuthenticated]);

  // ── Login: verify username exists & password matches website field ──
  const login = useCallback(async (username, password) => {
    try {
      const user = await getUserByUsername(username);
      if (!user) {
        throw new Error('User not found. Please check your username.');
      }
      if (user.website !== password) {
        throw new Error('Incorrect password. Please try again.');
      }
      dispatch({ type: AUTH_ACTIONS.LOGIN, payload: user });
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // ── Logout: clear localStorage & reset state ──
  const logout = useCallback(() => {
    localStorage.removeItem(LS_KEYS.CURRENT_USER);
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  // ── Register: create user on server, then set session ──
  const register = useCallback(async (userData) => {
    try {
      // Check if username already exists
      const existingUser = await getUserByUsername(userData.username);
      if (existingUser) {
        throw new Error('Username already exists. Please choose a different one.');
      }
      const newUser = await createUser(userData);
      dispatch({ type: AUTH_ACTIONS.REGISTER, payload: newUser });
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // ── Memoize context value to prevent unnecessary re-renders ──
  const value = useMemo(
    () => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      login,
      logout,
      register,
    }),
    [state.user, state.isAuthenticated, login, logout, register]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
