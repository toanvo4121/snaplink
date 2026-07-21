import { auth } from '@/auth';
import { redirect } from 'next/navigation';

/**
 * requireUser() / requireAdmin() — gọi ở ĐẦU mỗi Server Component/Server Action
 * cần bảo vệ. Đây là lớp kiểm tra "thật", không tin tưởng proxy.ts đã chặn
 * (xem giải thích trong proxy.ts). Mọi nơi động tới dữ liệu nhạy cảm đều
 * phải gọi lại 1 trong 2 hàm này.
 */
export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'ADMIN') {
    // 404 thay vì 403 để không "lộ" sự tồn tại của route admin cho user thường
    redirect('/not-found');
  }
  return user;
}

/** Dùng trong Server Action khi cần trả lỗi thay vì redirect (VD gọi từ form submit) */
export async function requireUserOrThrow() {
  const session = await auth();
  if (!session?.user) throw new Error('UNAUTHORIZED');
  return session.user;
}
