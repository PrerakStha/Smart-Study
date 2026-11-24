import { Link } from 'react-router-dom';

export default function SummaryPreview({ document }) {
  return (
    <section className="rounded-2xl border border-line bg-card p-6">
      <h3 className="text-sm font-semibold text-brand">Summary preview</h3>

      {document ? (
        <>
          <p className="mt-1 truncate text-xs text-zinc-500">{document.fileName}</p>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-300">{document.summaryPreview}</p>
          <Link
            to={`/documents/${document.id}/summary`}
            className="mt-4 inline-block rounded-lg border border-line px-4 py-2 text-sm font-medium transition hover:bg-white/5"
          >
            View full summary
          </Link>
        </>
      ) : (
        <p className="mt-3 text-sm text-zinc-400">
          Your latest summary will appear here once a document is ready.
        </p>
      )}
    </section>
  );
}