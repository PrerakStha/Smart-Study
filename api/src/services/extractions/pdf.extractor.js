// Import the file directly: pdf-parse's index.js tries to read a test PDF when
// loaded as an ES module and crashes.
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { ProcessingError } from '../../utils/ProcessingError.js';

export async function extractPdfText(buffer) {
  try {
    const { text } = await pdfParse(buffer);
    return text;
  } catch {
    throw new ProcessingError('This PDF could not be read. It may be corrupted or password-protected.');
  }
}