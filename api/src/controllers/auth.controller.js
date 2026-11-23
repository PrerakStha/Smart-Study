import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken } from '../utils/jwt.js';

const SALT_ROUNDS = 12;

// Compared against when the email doesn't exist, so response time doesn't
// reveal which emails are registered.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password-1', SALT_ROUNDS);

// POST /api/auth/register  (FR1)
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email is already registered');

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, passwordHash, role });

  res.status(201).json({
    success: true,
    message: 'Account created',
    data: { user, token: signToken(user) },
  });
});

// POST /api/auth/login  (FR2)
export const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email }).select('+passwordHash');

  const isMatch = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);
  if (!user || !isMatch) {
    // Same message for "no such user" and "wrong password"
    throw new ApiError(401, 'Invalid email or password');
  }

  // The login form has a role dropdown; if sent, it must match the account
  if (role && role !== user.role) {
    throw new ApiError(403, `This account is not registered as a ${role}`);
  }

  res.json({
    success: true,
    message: 'Logged in',
    data: { user, token: signToken(user) },
  });
});

// GET /api/auth/me  (protected) - lets the frontend restore a session on refresh
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});
