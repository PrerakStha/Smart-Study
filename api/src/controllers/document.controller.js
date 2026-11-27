import path from 'node:path';
import mongoose from 'mongoose';
import { Document } from '../models/Document.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { startProcessing } from '../services/generation.service.js';

const cleanName = (name) =>
  path.basename(name).replace(/[\u0000-\u001f]/g, '').trim().slice(0, 255) || 'untitled';

// POST /api/documents/upload  (FR4-FR6, FR8)
// By the time we get here: authenticated, rate-limited, file saved + verified, options validated.
export const uploadDocument = asyncHandler(async (req, res) => {
  const { file } = req;
  const { summary, quiz, flashcards } = req.body;

  const doc = await Document.create({
    userId: req.user._id,
    fileName: cleanName(file.originalname),
    fileType: path.extname(file.originalname).slice(1).toLowerCase(), // 'pdf' | 'txt'
    fileSize: file.size,
    fileUrl: file.filename,
    generate: { summary, quiz, flashcards },
    status: 'processing',
  });

  // NFR1: answer immediately, keep working in the background
  res.status(202).json({
    success: true,
    message: 'Upload accepted. Processing has started.',
    data: { document: doc },
  });

  startProcessing(doc._id);
});

// GET /api/documents  (FR7) - only the logged-in user's documents (NFR8)
export const listDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({ userId: req.user._id })
    .sort({ uploadedAt: -1 })
    .limit(100);

  res.json({ success: true, data: { documents } });
});

// GET /api/documents/:id
export const getDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new ApiError(404, 'Document not found');

  // Filtering by userId means other users' documents look like they don't exist
  const document = await Document.findOne({ _id: id, userId: req.user._id });
  if (!document) throw new ApiError(404, 'Document not found');

  res.json({ success: true, data: { document } });
});