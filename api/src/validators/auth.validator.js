import { z } from 'zod';

const roleEnum = z.enum(['student', 'teacher'], {
  errorMap: () => ({ message: 'Role must be student or teacher' }),
});

const email = z.string().trim().toLowerCase().email('Enter a valid email address');

// bcrypt only uses the first 72 bytes, so cap the length
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters')
  .regex(/[A-Za-z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60),
    email,
    password,
    confirmPassword: z.string(),
    role: roleEnum,
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
  role: roleEnum.optional(), // the login screen has a role dropdown
});
