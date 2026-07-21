'use server';

import { db } from '@/lib/db';
import { requireUserOrThrow } from '@/lib/rbac';
import { createLinkSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';
import { planFor } from '@/lib/plans';
import { revalidatePath } from 'next/cache';

export type ActionState = { error?: string; success?: boolean };

export async function createLink(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUserOrThrow();

  const parsed = createLinkSchema.safeParse({
    targetUrl: formData.get('targetUrl'),
    slug: formData.get('slug'),
    title: formData.get('title'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' };
  }

  // Kiểm tra giới hạn gói NGAY TRÊN SERVER — đây là chỗ enforce billing thật sự,
  // không chỉ ẩn/hiện nút ở UI.
  const dbUser = await db.user.findUniqueOrThrow({ where: { id: user.id } });
  const plan = planFor(dbUser.planStatus);
  const linkCount = await db.link.count({ where: { userId: user.id } });
  if (linkCount >= plan.maxLinks) {
    return { error: `Gói ${plan.name} chỉ cho phép tối đa ${plan.maxLinks} link. Hãy nâng cấp lên Pro.` };
  }

  const slug = parsed.data.slug || generateSlug();
  const existing = await db.link.findUnique({ where: { slug } });
  if (existing) {
    return { error: 'Slug này đã được dùng, hãy chọn slug khác.' };
  }

  await db.link.create({
    data: {
      slug,
      targetUrl: parsed.data.targetUrl,
      title: parsed.data.title || null,
      userId: user.id,
    },
  });

  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteLink(linkId: string) {
  const user = await requireUserOrThrow();

  // Kiểm tra sở hữu — user chỉ được xoá link của chính mình (admin xử lý riêng ở actions/admin.ts)
  const link = await db.link.findUnique({ where: { id: linkId } });
  if (!link || link.userId !== user.id) {
    throw new Error('FORBIDDEN');
  }

  await db.link.delete({ where: { id: linkId } });
  revalidatePath('/dashboard');
}
