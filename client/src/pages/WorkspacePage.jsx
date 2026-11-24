import { useState } from 'react';
import Dropzone from '../components/upload/Dropzone';
import GenerationOptions from '../components/upload/GenerationOptions';
import DocumentList from '../components/upload/DocumentList';
import SummaryPreview from '../components/upload/SummaryPreview';
import { useDocuments } from '../hooks/useDocuments';
import { uploadDocument } from '../api/documents.api';

export default function WorkspacePage() {
  const { documents, loading, error, addDocument } = useDocuments();

  const [file, setFile] = useState(null);
  const [options, setOptions] = useState({ summary: true, quiz: true, flashcards: true });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const nothingSelected = !Object.values(options).some(Boolean);
  const canSubmit = Boolean(file) && !uploading && !nothingSelected;

  const latestSummary = documents.find((d) => d.status === 'ready' && d.summaryPreview);

  const handleGenerate = async () => {
    if (!canSubmit) return;
    setUploading(true);
    setProgress(0);
    setUploadError('');

    try {
      const doc = await uploadDocument(file, options, setProgress);
      addDocument(doc); // appears in "My documents" as Processing, then polling updates it
      setFile(null);
    } catch (err) {
      const data = err.response?.data;
      setUploadError(
        data?.errors?.[0]?.message || data?.message || 'Upload failed. Check your connection and try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1.4fr_1fr]">
      {/* Left: upload */}
      <section>
        <h1 className="text-3xl font-bold">Upload notes</h1>
        <p className="mb-6 mt-4 text-sm text-zinc-400">Drop lecture slides or notes and choose what to generate.</p>

        <Dropzone file={file} onFileSelected={setFile} onError={setUploadError} disabled={uploading} />

        {uploadError && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            {uploadError}
          </p>
        )}

        <p className="mb-3 mt-7 text-sm text-zinc-400">Generate</p>
        <GenerationOptions value={options} onChange={setOptions} disabled={uploading} />
        {nothingSelected && <p className="mt-2 text-xs text-amber-300">Pick at least one option.</p>}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canSubmit}
          className="mt-5 w-full rounded-lg bg-brand py-3.5 text-sm font-semibold text-surface transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? `Uploading… ${progress}%` : 'Generate with Gemini'}
        </button>

        <p className="mt-3 text-xs text-zinc-500">
          Your text is sent to Google Gemini to generate study material.
        </p>
      </section>

      {/* Right: documents + summary */}
      <aside className="space-y-5">
        <DocumentList documents={documents} loading={loading} error={error} />
        <SummaryPreview document={latestSummary} />
      </aside>
    </main>
  );
}