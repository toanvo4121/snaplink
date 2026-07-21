'use server';

import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/rbac';
import { updateUserRoleSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function updateUserRole(formData: FormData) {
  const admin = await requireAdmin(); // ← lớp kiểm tra quyền THẬT, không tin proxy.ts

  const parsed = updateUserRoleSchema.safeParse({
    userId: formData.get('userId'),
    role: formData.get('role'),
  });
  if (!parsed.success) throw new Error('Dữ liệu không hợp lệ');

  // Chặn admin tự hạ quyền chính mình gây khoá tài khoản admin cuối cùng
  if (parsed.data.userId === admin.id && parsed.data.role !== 'ADMIN') {
    throw new Error('Không thể tự thu hồi quyền admin của chính mình');
  }

  await db.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
  });

  revalidatePath('/dashboard/admin');
}

export async function deleteUser(userId: string) {
  const admin = await requireAdmin();
  if (userId === admin.id) throw new Error('Không thể tự xoá chính mình');

  await db.user.delete({ where: { id: userId } });
  revalidatePath('/dashboard/admin');
}
