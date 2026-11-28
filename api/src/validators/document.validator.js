import { z } from 'zod';

// multipart form fields always arrive as strings: "true" | "false"
const flag = z
  .enum(['true', 'false'])
  .default('true')
  .transform((v) => v === 'true');

export const uploadOptionsSchema = z
  .object({ summary: flag, quiz: flag, flashcards: flag })
  .refine((o) => o.summary || o.quiz || o.flashcards, {
    message: 'Choose at least one thing to generate',
    path: ['generate'],
  });