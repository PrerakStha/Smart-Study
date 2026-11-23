import { ApiError } from '../utils/ApiError.js';

// Usage: router.post('/x', protect, authorize('teacher'), handler)
export const authorize =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to do this'));
    }
    next();
  };
