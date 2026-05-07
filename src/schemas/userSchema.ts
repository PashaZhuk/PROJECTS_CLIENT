import { z } from 'zod';

const baseSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Некорректный Email'),
  password: z.string().min(6, 'Минимум 6 символов'),
  role: z.enum(['ADMIN', 'MANAGER', 'USER']),
});

const partnerSchema = baseSchema.extend({
  role: z.literal('USER'),
  name: z.string().optional(),
  companyName: z.string().min(1, 'Название компании обязательно'),
  unp: z.string().regex(/^\d{9}$/, 'УНП должен содержать ровно 9 цифр'),
  phone: z.string().regex(/^\+375\d{9}$/, 'Формат: +375XXXXXXXXX'),
});

const managerSchema = baseSchema.extend({
  role: z.literal('MANAGER'),
  name: z.string().min(1, 'ФИО обязательно'),
  companyName: z.string().optional(),
  unp: z.string().optional(),
  phone: z.string().optional(),
});

const adminSchema = baseSchema.extend({
  role: z.literal('ADMIN'),
  name: z.string().min(1, 'ФИО обязательно'),
  companyName: z.string().optional(),
  unp: z.string().optional(),
  phone: z.string().optional(),
});

export const userFormSchema = z.discriminatedUnion('role', [
  partnerSchema,
  managerSchema,
  adminSchema,
]);

export type UserFormData = z.infer<typeof userFormSchema>;