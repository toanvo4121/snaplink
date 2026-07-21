import { z } from 'zod';

// Validate lại ở server dù client đã validate — nguyên tắc bảo mật bắt buộc
// (xem mục 8 "Security" trong tài liệu).
export const createLinkSchema = z.object({
  targetUrl: z.string().url({ message: 'URL không hợp lệ' }).max(2048),
  slug: z
    .string()
    .min(3, 'Slug cần ít nhất 3 ký tự')
    .max(30)
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ gồm chữ thường, số và dấu gạch ngang')
    .optional()
    .or(z.literal('')),
  title: z.string().max(100).optional().or(z.literal('')),
});

export const updateUserRoleSchema = z.object({
  userId: z.string().cuid(),
  role: z.enum(['USER', 'ADMIN']),
});
