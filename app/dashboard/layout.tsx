import { requireUser } from '@/lib/rbac';
import { Sidebar } from '@/components/dashboard/sidebar';

// Lớp bảo vệ THẬT cho toàn bộ khu vực /dashboard — proxy.ts chỉ lo redirect UX,
// còn requireUser() ở đây mới thực sự chặn truy cập nếu chưa đăng nhập.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen">
      <Sidebar role={user.role} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
