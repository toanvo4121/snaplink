'use client';

import { SessionProvider } from 'next-auth/react';

// Đây là 1 trong số ít lý do chính đáng để có 'use client' ở gần root:
// SessionProvider dùng React Context, bắt buộc phải chạy client-side để
// các Client Component con (VD nút Đăng xuất) gọi được useSession()/signOut().
// Bản thân children vẫn có thể là Server Component bình thường (composition pattern).
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
