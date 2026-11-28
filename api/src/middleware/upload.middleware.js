import path from 'node:path';
import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';
import { multerStorage, readFileHead, removeFile } from '../services/storage/index.js';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB (FR5)
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.txt']);

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return cb(new ApiError(400, 'Only PDF and TXT files are supported.'));
    }
    cb(null, true);
  },
}).single('file');

// Wraps multer so its errors become our normal { success:false, message } responses
export function uploadDocumentFile(req, res, next) {
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ApiError(400, 'File is too large. The maximum size is 10 MB.'));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.code === 'LIMIT_FILE_COUNT') {
          return next(new ApiError(400, 'Upload exactly one file in a field named "file".'));
        }
        return next(new ApiError(400, err.message));
      }
      return next(err);
    }
    if (!req.file) return next(new ApiError(400, 'No file uploaded.'));
    next();
  });
}

// The extension and mimetype come from the client and can be faked,
// so also check the real file contents.
export async function verifyFileContent(req, _res, next) {
  try {
    const head = await readFileHead(req.file.filename, 1024);
    const isPdf = path.extname(req.file.originalname).toLowerCase() === '.pdf';
    const valid = isPdf
      ? head.subarray(0, 5).toString('latin1') === '%PDF-'
      : !head.includes(0); // text files never contain NUL bytes
    if (!valid) throw new ApiError(400, 'The file content does not match a valid PDF or TXT file.');
    next();
  } catch (err) {
    next(err);
  }
}

// Place AFTER the handlers in a route: if anything failed, don't leave the file on disk.
// Awaited so the file is gone before the error response is sent.
// eslint-disable-next-line no-unused-vars
export async function discardUploadOnError(err, req, _res, next) {
  if (req.file) await removeFile(req.file.filename).catch(() => {});
  next(err);
}