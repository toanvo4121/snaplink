import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

/**
 * proxy.ts — tên quy ước mới thay cho middleware.ts kể từ Next.js 16.
 * Chạy ở Edge Runtime nên chỉ import authConfig (không có Prisma adapter).
 *
 * ⚠️ QUAN TRỌNG: file này chỉ dùng để REDIRECT cho trải nghiệm người dùng
 * (chưa đăng nhập → đẩy về /login). Đây KHÔNG phải lớp bảo vệ dữ liệu duy nhất.
 * Mọi Server Action / Server Component / Route Handler nhạy cảm vẫn phải tự
 * kiểm tra session + quyền hạn riêng (xem lib/rbac.ts) — bài học từ lỗ hổng
 * CVE-2025-29927 (bypass middleware bằng header giả mạo).
 */
export const { auth: proxy } = NextAuth(authConfig);

export const config = {
  // Chỉ chạy proxy trên các route cần redirect, bỏ qua static asset để đỡ tốn tài nguyên
  matcher: ['/dashboard/:path*'],
};
