import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'EMPLOYEE']),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'EMPLOYEE']).default('EMPLOYEE'),
  department: z.string().min(2, 'Department is required'),
  designation: z.string().min(2, 'Designation is required'),
  joiningDate: z.string().optional(),
  phone: z.string().optional(),
});

export const employeeCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').default('password123'),
  role: z.enum(['ADMIN', 'EMPLOYEE']).default('EMPLOYEE'),
  department: z.string().min(2, 'Department is required'),
  designation: z.string().min(2, 'Designation is required'),
  joiningDate: z.string().optional(),
  phone: z.string().optional(),
});

export const leaveSchema = z.object({
  leaveType: z.enum(['CASUAL', 'SICK', 'EARNED', 'UNPAID']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(5, 'Reason must be at least 5 characters long'),
});

export const holidaySchema = z.object({
  title: z.string().min(2, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  type: z.enum(['NATIONAL', 'COMPANY', 'OPTIONAL']).default('NATIONAL'),
});
