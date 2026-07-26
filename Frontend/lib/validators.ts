import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['ADMIN', 'EMPLOYEE']),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['ADMIN', 'EMPLOYEE']),
  department: z.string().optional(),
  designation: z.string().optional(),
  phone: z.string().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const employeeCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['ADMIN', 'EMPLOYEE']),
  department: z.string().min(2, 'Department is required'),
  designation: z.string().min(2, 'Designation is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  phone: z.string().optional(),
});

export type EmployeeCreateFormData = z.infer<typeof employeeCreateSchema>;

export const leaveRequestSchema = z.object({
  leaveType: z.enum(['CASUAL', 'SICK', 'EARNED', 'UNPAID']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(5, 'Reason must be at least 5 characters long'),
});

export type LeaveRequestFormData = z.infer<typeof leaveRequestSchema>;

export const holidaySchema = z.object({
  title: z.string().min(2, 'Holiday title is required'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  type: z.enum(['NATIONAL', 'COMPANY', 'OPTIONAL']),
});

export type HolidayFormData = z.infer<typeof holidaySchema>;
