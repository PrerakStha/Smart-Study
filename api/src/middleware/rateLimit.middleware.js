import rateLimit from 'express-rate-limit';

// Slows down brute-force login attempts and registration spam (NFR7)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later' },
});

// Protects the Gemini API quota (NFR7). Runs after protect, so it limits per user.
export const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user.id,
  message: { success: false, message: 'Too many uploads. Please wait a few minutes and try again.' },
});