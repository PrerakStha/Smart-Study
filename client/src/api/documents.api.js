import api from './axios';
import * as mock from './documents.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// GET /documents -> { data: { documents: [...] } }  (newest first, current user only)
export async function listDocuments() {
  if (USE_MOCK) return mock.listDocuments();
  const res = await api.get('/documents');
  return res.data.data.documents;
}

// POST /documents/upload (multipart) -> 202 { data: { document } }
// options = { summary: boolean, quiz: boolean, flashcards: boolean }
export async function uploadDocument(file, options, onProgress) {
  if (USE_MOCK) return mock.uploadDocument(file, options, onProgress);

  const form = new FormData();
  form.append('file', file);
  form.append('summary', String(options.summary));
  form.append('quiz', String(options.quiz));
  form.append('flashcards', String(options.flashcards));

  const res = await api.post('/documents/upload', form, {
    onUploadProgress: (e) => {
      if (e.total) onProgress?.(Math.round((e.loaded * 100) / e.total));
    },
  });
  return res.data.data.document;
}