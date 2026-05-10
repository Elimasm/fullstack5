import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to access auth context.
 * Provides user, isAuthenticated, login, logout, register.
 */
export const useAuth = () => {
  // AuthContext is an object that contains the state and the functions to update the state.
  // the state means if user is logged in or not 
  const context = useContext(AuthContext); 
  if (!context) { // if there is no context, it means we are not in the AuthProvider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context; 
};
