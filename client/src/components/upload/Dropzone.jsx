import { useRef, useState } from 'react';

export const MAX_SIZE = 10 * 1024 * 1024; // 10 MB (FR5)
const ALLOWED_EXTENSIONS = ['pdf', 'txt'];

export function validateFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) return 'Only PDF and TXT files are supported.';
  if (file.size === 0) return 'This file is empty.';
  if (file.size > MAX_SIZE) return 'File is too large. The maximum size is 10 MB.';
  return null;
}

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Dropzone({ file, onFileSelected, onError, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleFiles = (files) => {
    const picked = files?.[0];
    if (!picked) return;
    const problem = validateFile(picked);
    if (problem) {
      onError(problem);
      return;
    }
    onError('');
    onFileSelected(picked);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  };

  const onDragLeave = (e) => {
    // ignore leave events fired when moving over child elements
    if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
  };

  const clear = (e) => {
    e.stopPropagation();
    onFileSelected(null);
    onError('');
  };

  return (
    <div
      onClick={openPicker}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`flex min-h-[18.5rem] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
        dragging ? 'border-brand bg-drop brightness-125' : 'border-brand/50 bg-drop'
      } ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,application/pdf,text/plain"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = ''; // lets the same file be picked again after removing it
        }}
      />

      {file ? (
        <>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/20 text-xs font-bold text-brand">
            {file.name.split('.').pop().toUpperCase()}
          </div>
          <p className="mt-5 max-w-full truncate text-lg font-semibold">{file.name}</p>
          <p className="mt-1 text-sm text-zinc-400">{formatSize(file.size)} · ready to upload</p>
          <button
            type="button"
            onClick={clear}
            disabled={disabled}
            className="mt-5 rounded-lg border border-line px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 disabled:opacity-50"
          >
            Remove file
          </button>
        </>
      ) : (
        <>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/20 text-brand">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </div>
          <p className="mt-6 text-xl font-semibold">Drag &amp; drop PDF or TXT here</p>
          <p className="mt-3 text-sm text-zinc-400">or click to browse · max 10 MB</p>
          <button
            type="button"
            disabled={disabled}
            className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-brand-hover"
          >
            Choose file
          </button>
        </>
      )}
    </div>
  );
}