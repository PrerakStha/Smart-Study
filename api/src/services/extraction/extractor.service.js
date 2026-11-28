import { readFile } from '../storage/index.js';
import { extractPdfText } from './pdf.extractor.js';
import { extractTxtText } from './txt.extractor.js';

function normalise(text) {
  return text
    .replace(/\u0000/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Single entry point for the rest of the app: extractText(fileUrl, 'pdf' | 'txt')
export async function extractText(fileUrl, fileType) {
  const buffer = await readFile(fileUrl);
  const raw = fileType === 'pdf' ? await extractPdfText(buffer) : extractTxtText(buffer);
  return normalise(raw);
}