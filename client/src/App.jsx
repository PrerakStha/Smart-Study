import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import WorkspacePage from './pages/WorkspacePage';
import ComingSoonPage from './pages/ComingSoonPage';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute, { FullScreenSpinner } from './components/layout/ProtectedRoute';

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

      {/* Everything inside here needs a login and gets the navbar */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/workspace" element={<WorkspacePage />} />
        <Route path="/quizzes" element={<ComingSoonPage title="Quizzes" />} />
        <Route path="/flashcards" element={<ComingSoonPage title="Flashcards" />} />
        <Route path="/dashboard" element={<ComingSoonPage title="Dashboard" />} />
        <Route path="/documents/:id/summary" element={<ComingSoonPage title="Summary" />} />
      </Route>

      <Route path="/" element={<Navigate to="/workspace" replace />} />
      <Route path="*" element={<Navigate to="/workspace" replace />} />
    </Routes>
  );
}