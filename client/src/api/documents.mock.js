// In-memory fake backend so the UI can be built and demoed before the real
// upload endpoints exist. Enable with VITE_USE_MOCK=true.
// Tip: upload a file with "fail" in its name to see the failed state.

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();

let documents = [
  {
    id: 'm1',
    fileName: 'Databases_Notes.pdf',
    fileType: 'pdf',
    status: 'ready',
    questionCount: 12,
    flashcardCount: 20,
    summaryPreview:
      'Normalization reduces redundancy by organising data into related tables. Key forms: 1NF, 2NF, 3NF and BCNF.',
    errorMessage: null,
    uploadedAt: now(),
  },
  {
    id: 'm2',
    fileName: 'Networking_Revision.txt',
    fileType: 'txt',
    status: 'ready',
    questionCount: 10,
    flashcardCount: 15,
    summaryPreview: 'The OSI model splits networking into seven layers, from physical up to application.',
    errorMessage: null,
    uploadedAt: now(),
  },
  {
    id: 'm3',
    fileName: 'Old_Slides.pdf',
    fileType: 'pdf',
    status: 'failed',
    questionCount: 0,
    flashcardCount: 0,
    summaryPreview: null,
    errorMessage: 'Text extraction failed. Try again.',
    uploadedAt: now(),
  },
];

export async function listDocuments() {
  await delay(250);
  return documents.map((d) => ({ ...d }));
}

export async function uploadDocument(file, options, onProgress) {
  for (let p = 0; p <= 100; p += 20) {
    onProgress?.(p);
    await delay(120);
  }

  const id = `m${Date.now()}`;
  const ext = file.name.split('.').pop().toLowerCase();
  const doc = {
    id,
    fileName: file.name,
    fileType: ext === 'txt' ? 'txt' : 'pdf',
    status: 'processing',
    questionCount: 0,
    flashcardCount: 0,
    summaryPreview: null,
    errorMessage: null,
    uploadedAt: now(),
  };
  documents = [doc, ...documents];

  // Pretend Gemini takes a few seconds
  setTimeout(() => {
    documents = documents.map((d) => {
      if (d.id !== id) return d;
      if (file.name.toLowerCase().includes('fail')) {
        return { ...d, status: 'failed', errorMessage: 'Text extraction failed. Try again.' };
      }
      return {
        ...d,
        status: 'ready',
        questionCount: options.quiz ? 10 : 0,
        flashcardCount: options.flashcards ? 15 : 0,
        summaryPreview: options.summary
          ? `This is a mock summary of ${file.name}. The real one will come from Gemini.`
          : null,
      };
    });
  }, 6000);

  return { ...doc };
}