import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

export function FullScreenSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand" />
    </div>
  );
}

// <ProtectedRoute>…</ProtectedRoute>                     any logged-in user
// <ProtectedRoute roles={['teacher']}>…</ProtectedRoute> only teachers
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenSpinner />;
  if (!user) return <Navigate to="/auth" replace state={{ from: location }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/workspace" replace />;

  return children;
}
