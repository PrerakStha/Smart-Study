// NFR14: everything else imports storage from HERE.
// To move to cloud storage later, replace this export with an S3/Cloudinary
// implementation that exposes the same functions - nothing else changes.
export * from './local.storage.js';