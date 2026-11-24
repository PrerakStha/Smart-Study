import { useAuth } from '../hooks/useAuth';

// Placeholder so login/register has somewhere to land.
// Replace with the real upload + document list page.
export default function WorkspacePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-panel p-8">
        <h1 className="text-2xl font-bold">Welcome, {user.name} 👋</h1>
        <p className="mt-2 text-zinc-400">
          Logged in as <span className="text-white">{user.email}</span> ({user.role}).
        </p>
        <p className="mt-6 text-sm text-zinc-500">The upload workspace goes here.</p>
        <button
          onClick={logout}
          className="mt-8 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-surface hover:bg-brand-hover"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
