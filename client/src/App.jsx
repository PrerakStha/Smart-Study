import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import WorkspacePage from './pages/WorkspacePage';
import ProtectedRoute, { FullScreenSpinner } from './components/layout/layout/ProtectedRoute';

// Logged-in users shouldn't see the login page again
function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenSpinner />;
  return user ? <Navigate to="/workspace" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />
      <Route path="/workspace" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/workspace" replace />} />
      <Route path="*" element={<Navigate to="/workspace" replace />} />
    </Routes>
  );
}
