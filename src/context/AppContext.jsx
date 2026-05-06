import { AuthProvider } from './AuthContext';
import { CacheProvider } from './CacheContext';

/**
 * AppProvider wraps the application with all global context providers.
 * Order matters: CacheProvider is outer so AuthProvider can use it if needed.
 */
export const AppProvider = ({ children }) => {
  return (
    <CacheProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </CacheProvider>
  );
};
