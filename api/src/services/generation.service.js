import { Document } from '../models/Document.js';
import { ProcessingError } from '../utils/ProcessingError.js';
import { extractText } from './extraction/extractor.service.js';
import { generateStudyMaterial } from './ai/gemini.service.js';

const MIN_TEXT_CHARS = 50; // below this there's nothing useful to generate from
const MAX_TEXT_CHARS = 300_000; // keeps us inside the model's token limit

// Runs in the background after the 202 response has been sent.
// extract text -> generate -> mark ready (or failed, FR12 / NFR11)
export async function processDocument(documentId) {
  const doc = await Document.findById(documentId).select('+fileUrl +extractedText');
  if (!doc) return;

  try {
    let text = await extractText(doc.fileUrl, doc.fileType);
    if (text.length < MIN_TEXT_CHARS) {
      throw new ProcessingError(
        'No readable text found in this file. Scanned or image-only PDFs are not supported.'
      );
    }
    if (text.length > MAX_TEXT_CHARS) text = text.slice(0, MAX_TEXT_CHARS);

    doc.extractedText = text;
    await doc.save();

    const material = await generateStudyMaterial(text, doc.generate);

    doc.questionCount = material.questionCount;
    doc.flashcardCount = material.flashcardCount;
    doc.summaryPreview = material.summaryPreview;
    doc.status = 'ready';
    doc.errorMessage = null;
    await doc.save();
  } catch (err) {
    console.error(`[processing] document ${documentId} failed:`, err.message);
    const message =
      err instanceof ProcessingError ? err.message : 'Text extraction failed. Try again.';
    await Document.updateOne({ _id: documentId }, { status: 'failed', errorMessage: message });
  }
}

// Fire-and-forget wrapper used by the controller
export function startProcessing(documentId) {
  setImmediate(() => {
    processDocument(documentId).catch((err) =>
      console.error('[processing] unexpected error:', err)
    );
  });
}

// If the server restarts mid-processing, those documents would stay "processing" forever.
// Call once at startup. (Assumes a single server instance, which is fine for this project.)
export async function failStuckDocuments() {
  const res = await Document.updateMany(
    { status: 'processing' },
    { status: 'failed', errorMessage: 'Processing was interrupted. Please upload again.' }
  );
  if (res.modifiedCount) console.log(`Marked ${res.modifiedCount} interrupted document(s) as failed`);
}