import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/rbac';
import { planFor } from '@/lib/plans';
import { LinkForm } from '@/components/dashboard/link-form';
import { LinksTable } from '@/components/dashboard/links-table';

export const metadata: Metadata = { title: 'Link của tôi' };

// Trang này KHÔNG cache — dữ liệu gắn với từng user đăng nhập, luôn render động.
// (Đây là hành vi mặc định trong mô hình Cache Components của Next 16: mọi thứ
// dynamic trừ khi chủ động khai báo "use cache".)
export default async function DashboardPage() {
  const user = await requireUser();

  const [links, dbUser] = await Promise.all([
    db.link.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { clicks: true } } },
    }),
    db.user.findUniqueOrThrow({ where: { id: user.id } }),
  ]);

  const plan = planFor(dbUser.planStatus);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Link của tôi</h1>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
          {links.length}/{plan.maxLinks === Infinity ? '∞' : plan.maxLinks} link · Gói {plan.name}
        </span>
      </div>

      <div className="mt-6">
        <LinkForm />
      </div>

      <LinksTable links={links} />
    </div>
  );
}
