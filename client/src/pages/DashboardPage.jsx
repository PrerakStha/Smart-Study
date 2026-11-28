import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDocuments } from '../hooks/useDocuments';

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-line bg-panel p-5">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

const STATUS_STYLE = {
  ready: 'bg-brand/15 text-brand',
  processing: 'bg-field text-zinc-300',
  failed: 'bg-red-400/10 text-red-300',
};

// Tries the common field names, so it works with your data
const titleOf = (d) => d.title || d.originalName || d.fileName || d.filename || d.name || 'Untitled';
const dateOf = (d) => d.createdAt || d.uploadedAt || d.created_at || d.date || null;

// Counts documents for each of the last 7 days
function lastSevenDays(documents) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    days.push({ key: day.toDateString(), label: day.toLocaleDateString('en-US', { weekday: 'short' }), count: 0 });
  }
  documents.forEach((d) => {
    const raw = dateOf(d);
    if (!raw) return;
    const when = new Date(raw);
    if (Number.isNaN(when.getTime())) return;
    const slot = days.find((x) => x.key === when.toDateString());
    if (slot) slot.count += 1;
  });
  return days;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { documents, loading, error } = useDocuments();

  const ready = documents.filter((d) => d.status === 'ready').length;
  const processing = documents.filter((d) => d.status === 'processing').length;
  const failed = documents.filter((d) => d.status === 'failed').length;

  const recent = documents.slice(0, 6);
  const latestSummary = documents.find((d) => d.status === 'ready' && d.summaryPreview);

  const week = lastSevenDays(documents);
  const weekMax = Math.max(1, ...week.map((x) => x.count));
  const weekTotal = week.reduce((sum, x) => sum + x.count, 0);

  const statusRows = [
    { label: 'Ready', value: ready, color: 'bg-brand' },
    { label: 'Processing', value: processing, color: 'bg-zinc-500' },
    { label: 'Failed', value: failed, color: 'bg-red-400' },
  ];
  const total = Math.max(1, documents.length);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="mt-1 text-sm capitalize text-zinc-400">{user.role} dashboard</p>
        </div>
        <Link
          to="/workspace"
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-surface hover:bg-brand-hover"
        >
          Upload notes
        </Link>
      </div>

      {error && (
        <p role="alert" className="mb-6 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Documents" value={documents.length} />
        <StatCard label="Ready" value={ready} />
        <StatCard label="Processing" value={processing} />
        <StatCard label="Failed" value={failed} />
      </section>

      {/* Graphs */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-line bg-panel p-5">
          <h2 className="font-semibold">Uploads, last 7 days</h2>
          <div className="mt-6 flex h-40 items-end gap-3">
            {week.map((x) => (
              <div key={x.key} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs text-zinc-400">{x.count > 0 ? x.count : ''}</span>
                <div
                  className="w-full rounded-t-md bg-brand"
                  style={{ height: `${(x.count / weekMax) * 100}%`, minHeight: x.count > 0 ? '6px' : '2px', opacity: x.count > 0 ? 1 : 0.25 }}
                />
                <span className="text-xs text-zinc-500">{x.label}</span>
              </div>
            ))}
          </div>
          {weekTotal === 0 && documents.length > 0 && (
            <p className="mt-4 text-xs text-zinc-500">No uploads in the last 7 days, or your documents have no date.</p>
          )}
        </section>

        <section className="rounded-xl border border-line bg-panel p-5">
          <h2 className="font-semibold">Documents by status</h2>
          <ul className="mt-6 space-y-5">
            {statusRows.map((r) => (
              <li key={r.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span>{r.label}</span>
                  <span className="text-zinc-400">{r.value}</span>
                </div>
                <div className="h-2.5 rounded-full bg-field">
                  <div className={`h-2.5 rounded-full ${r.color}`} style={{ width: `${(r.value / total) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-line bg-panel p-5 lg:col-span-2">
          <h2 className="mb-4 font-semibold">Recent documents</h2>
          {loading ? (
            <p className="py-6 text-sm text-zinc-500">Loading...</p>
          ) : recent.length === 0 ? (
            <p className="py-6 text-sm text-zinc-500">
              No documents yet.{' '}
              <Link to="/workspace" className="text-brand underline underline-offset-4">Upload your first notes</Link>.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{titleOf(d)}</p>
                    {dateOf(d) && <p className="text-xs text-zinc-500">{new Date(dateOf(d)).toLocaleDateString()}</p>}
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs capitalize ${STATUS_STYLE[d.status] || STATUS_STYLE.processing}`}>
                    {d.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-line bg-panel p-5">
          <h2 className="mb-4 font-semibold">Latest summary</h2>
          {latestSummary ? (
            <>
              <p className="text-sm font-medium">{titleOf(latestSummary)}</p>
              <p className="mt-2 line-clamp-6 text-sm text-zinc-400">{latestSummary.summaryPreview}</p>
            </>
          ) : (
            <p className="text-sm text-zinc-500">Your newest summary will show here once a document is ready.</p>
          )}
        </section>
      </div>
    </main>
  );
}
