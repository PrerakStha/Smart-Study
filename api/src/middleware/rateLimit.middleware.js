import rateLimit from 'express-rate-limit';

// Slows down brute-force login attempts and registration spam (NFR7)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later' },
});
