import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is Required' })
    .email({ message: 'Please enter a valid email' }),
  password: z.string().min(6).max(32),
});
