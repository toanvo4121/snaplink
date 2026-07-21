import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

/**
 * Config "nhẹ" — KHÔNG import PrismaAdapter ở đây.
 * Lý do: file này còn được `proxy.ts` import để chạy trên Edge Runtime,
 * mà Prisma (qua driver Node) không chạy được trên Edge.
 * Đây chính là pattern khuyến nghị để tránh lỗi khi build/deploy.
 */
export const authConfig = {
  providers: [Google, GitHub],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // Chạy được cả trên Edge (proxy) lẫn Node — chỉ dùng dữ liệu có sẵn trong token,
    // KHÔNG query DB ở đây.
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as 'USER' | 'ADMIN';
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
