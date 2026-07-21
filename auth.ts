import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { authConfig } from './auth.config';

/**
 * Provider "đăng nhập test" — CHỈ tồn tại khi E2E_TESTING=true (set trong CI/Playwright,
 * không bao giờ set ở production). Không kiểm tra mật khẩu thật, chỉ tra theo email đã
 * seed sẵn (prisma/seed.ts) — mục đích DUY NHẤT là để Playwright bỏ qua OAuth thật,
 * vì Google/GitHub OAuth flow không tự động hoá được trong E2E mà không mock phức tạp.
 */
const testCredentialsProvider = Credentials({
  id: 'test-credentials',
  name: 'Test login',
  credentials: { email: { label: 'Email', type: 'email' } },
  async authorize(credentials) {
    if (process.env.E2E_TESTING !== 'true') return null; // khoá cứng ngoài môi trường test
    const email = credentials?.email as string | undefined;
    if (!email) return null;
    return db.user.findUnique({ where: { email } });
  },
});

/**
 * Config đầy đủ — dùng ở Node runtime (Server Component, Server Action, Route Handler).
 * KHÔNG import file này trong proxy.ts (xem giải thích trong auth.config.ts).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    ...(process.env.E2E_TESTING === 'true' ? [testCredentialsProvider] : []),
  ],
  adapter: PrismaAdapter(db),
  // JWT (không phải database session) — vì `proxy.ts` chạy ở Edge Runtime và cần
  // đọc/verify session mà KHÔNG được gọi DB (adapter không khả dụng ở Edge).
  // Đánh đổi: không revoke session tức thì được (phải chờ JWT hết hạn hoặc
  // tự thêm cơ chế denylist nếu cần ban user ngay lập tức — xem lib/rbac.ts).
  session: { strategy: 'jwt' },
});

// Mở rộng type cho session.user để có thêm `role`
declare module 'next-auth' {
  interface User {
    role?: 'USER' | 'ADMIN';
  }
  interface Session {
    user: {
      id: string;
      role: 'USER' | 'ADMIN';
    } & DefaultSessionUser;
  }
}

type DefaultSessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};
