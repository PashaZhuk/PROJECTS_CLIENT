import { z } from 'zod';

export const forceChangePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, 'Минимум 6 символов')
    .regex(/[A-Za-z]/, 'Должны быть буквы') // Опционально: требование к сложности
    .regex(/[0-9]/, 'Должны быть цифры'),   // Опционально
  
  confirmPassword: z.string(),
})
.refine((data) => data.newPassword === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"], // Ошибка привяжется именно к этому полю
});

export type ForceChangePasswordFormData = z.infer<typeof forceChangePasswordSchema>;