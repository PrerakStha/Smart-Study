const BADGES = {
  processing: ['Processing', 'bg-brand/20 text-brand'],
  ready: ['Ready', 'bg-emerald-500/15 text-emerald-400'],
  failed: ['Failed', 'bg-red-500/15 text-red-400'],
};

function meta(doc) {
  if (doc.status === 'failed') return doc.errorMessage || 'Something went wrong. Try again.';
  const parts = [];
  if (doc.questionCount > 0) parts.push(`${doc.questionCount} questions`);
  if (doc.flashcardCount > 0) parts.push(`${doc.flashcardCount} cards`);
  if (doc.summaryPreview) parts.push('summary');
  return parts.length ? parts.join(' · ') : 'No material generated';
}

function DocumentRow({ doc }) {
  const [label, badgeClass] = BADGES[doc.status] || BADGES.failed;

  return (
    <li className="flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-field text-[0.65rem] font-bold text-zinc-400">
        {doc.fileType.toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{doc.fileName}</p>
        {doc.status === 'processing' ? (
          <div className="mt-2.5 h-1.5 w-full max-w-[15rem] overflow-hidden rounded-full bg-line">
            <div className="progress-indeterminate h-full w-1/3 rounded-full bg-brand" />
          </div>
        ) : (
          <p className="mt-1 truncate text-xs text-zinc-400">{meta(doc)}</p>
        )}
      </div>

      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}>{label}</span>
    </li>
  );
}

// FR7: list of the user's documents with status and generated counts
export default function DocumentList({ documents, loading, error }) {
  return (
    <section className="rounded-2xl border border-line bg-card p-6">
      <h2 className="mb-6 text-xl font-bold">My documents</h2>

      {loading && <p className="text-sm text-zinc-400">Loading your documents…</p>}

      {!loading && error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}

      {!loading && !error && documents.length === 0 && (
        <p className="text-sm text-zinc-400">No documents yet. Upload your first notes to get started.</p>
      )}

      {!loading && documents.length > 0 && (
        <ul className="space-y-6">
          {documents.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} />
          ))}
        </ul>
      )}
    </section>
  );
}