import { z } from 'zod';

export const userIdSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: 'User ID must be a number' })
    .int('User ID must be an integer')
    .positive('User ID must be positive'),
});

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(255, 'Name must not exceed 255 characters')
      .optional(),
    email: z
      .string()
      .trim()
      .email('Invalid email address')
      .max(255, 'Email must not exceed 255 characters')
      .toLowerCase()
      .optional(),
    role: z.enum(['user', 'admin']).optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });
