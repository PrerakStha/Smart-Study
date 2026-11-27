import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { uploadLimiter } from '../middleware/rateLimit.middleware.js';
import {
  uploadDocumentFile,
  verifyFileContent,
  discardUploadOnError,
} from '../middleware/upload.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { uploadOptionsSchema } from '../validators/document.validator.js';
import { uploadDocument, listDocuments, getDocument } from '../controllers/document.controller.js';

const router = Router();

router.use(protect); // every document route needs a login

router.get('/', listDocuments);
router.get('/:id', getDocument);

// Order matters: limit -> save file -> check contents -> check options -> handle.
// discardUploadOnError last: deletes the saved file if any earlier step failed.
router.post(
  '/upload',
  uploadLimiter,
  uploadDocumentFile,
  verifyFileContent,
  validate(uploadOptionsSchema),
  uploadDocument,
  discardUploadOnError
);

export default router;