import { z } from 'zod';

// Базовая схема (теперь name не обязателен по умолчанию)
const baseSchema = z.object({
  name: z.string().optional(), // Делаем опциональным, проверим обязательность внутри ролей
  email: z.string().email('Некорректный Email'),
  password: z.string().min(6, 'Минимум 6 символов'),
  role: z.enum(['ADMIN', 'MANAGER', 'USER']),
});

// Схема для ПАРТНЕРА (USER)
// name убран или сделан опциональным, добавлены поля компании
const partnerSchema = baseSchema.extend({
  role: z.literal('USER'),
  name: z.string().optional(), // Или .min(1), если контактное лицо все же нужно. Сейчас сделал необязательным.
  companyName: z.string().min(1, 'Название компании обязательно'),
  unp: z.string().regex(/^\d{9}$/, 'УНП должен содержать ровно 9 цифр'),
  phone: z.string().regex(/^\+375\d{9}$/, 'Формат: +375XXXXXXXXX'),
});

// Схема для МЕНЕДЖЕРА (и АДМИНА)
// Здесь name ОБЯЗАТЕЛЕН
const managerSchema = baseSchema.extend({
  role: z.literal('MANAGER'),
  name: z.string().min(1, 'ФИО обязательно'), // Возвращаем обязательность
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