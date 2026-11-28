import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import multer from 'multer';

// server/uploads  (gitignored)
const uploadDir = fileURLToPath(new URL('../../../uploads', import.meta.url));
fs.mkdirSync(uploadDir, { recursive: true });

// Only ever called with names WE generated, but basename() keeps it traversal-safe anyway
const resolve = (fileUrl) => path.join(uploadDir, path.basename(fileUrl));

// Random file names: users can't overwrite each other's files or guess paths
export const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) =>
    cb(null, `${randomUID()}${path.extname(file.originalname).toLowerCase()}`),
});

export const readFile = (fileUrl) => fsp.readFile(resolve(fileUrl));

export async function readFileHead(fileUrl, bytes = 1024) {
  const handle = await fsp.open(resolve(fileUrl), 'r');
  try {
    const buf = Buffer.alloc(bytes);
    const { bytesRead } = await handle.read(buf, 0, bytes, 0);
    return buf.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}

export const removeFile = (fileUrl) => fsp.rm(resolve(fileUrl), { force: true });