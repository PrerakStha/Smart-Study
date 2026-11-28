// ──────────────────────────────────────────────────────────────────────────
// TODO (Prerak, AI lead): replace this stub with the real Gemini integration.
//
// Input
//   text    the extracted document text
//   options { summary: boolean, quiz: boolean, flashcards: boolean }
//
// What the real version must do (FR9-FR12)
//   1. Call Gemini with a strict "use only the text supplied" prompt
//   2. Validate the JSON reply with Zod; throw ProcessingError if invalid
//   3. Save Summary / Quiz + Questions / Flashcards documents
//
// Return, so the "My documents" list can show the numbers:
//   { summaryPreview: string | null, questionCount: number, flashcardCount: number }
//   (summaryPreview = first ~200 characters of the summary)
// ──────────────────────────────────────────────────────────────────────────
export async function generateStudyMaterial(_text, _options) {
  console.warn('[gemini] generateStudyMaterial is still a stub - nothing was generated');
  return { summaryPreview: null, questionCount: 0, flashcardCount: 0 };
}