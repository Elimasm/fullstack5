import { useAuth } from '../../hooks/useAuth';
import ErrorMessage from '../UI/ErrorMessage';

/**
 * Guard component that verifies the active user owns the resource.
 * If userId doesn't match, displays an access denied message.
 *
 * @param {number} resourceUserId - The userId field of the resource being accessed.
 * @param {React.ReactNode} children - Content to render if access is granted.
 */
const OwnerGuard = ({ resourceUserId, children, fallbackMessage = 'Access denied. This resource belongs to another user.' }) => {
  const { user } = useAuth();

  if (!user || user.id !== resourceUserId) {
    return <ErrorMessage message={fallbackMessage} />;
  }

  return children;
};

export default OwnerGuard;
