import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/rbac';
import { ClickChart } from '@/components/dashboard/click-chart';

async function ClickStats({ linkId }: { linkId: string }) {
  const clicks = await db.click.findMany({ where: { linkId }, orderBy: { createdAt: 'asc' } });

  // Gộp click theo ngày để vẽ biểu đồ đường
  const byDate = new Map<string, number>();
  for (const click of clicks) {
    const day = click.createdAt.toISOString().slice(0, 10);
    byDate.set(day, (byDate.get(day) ?? 0) + 1);
  }
  const data = Array.from(byDate.entries()).map(([date, count]) => ({ date, count }));

  return <ClickChart data={data} />;
}

export default async function LinkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();

  const link = await db.link.findUnique({ where: { id } });
  // Kiểm tra sở hữu ngay tại đây — không chỉ dựa vào việc route nằm trong /dashboard
  if (!link || link.userId !== user.id) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">{link.title || link.slug}</h1>
      <p className="mt-1 text-sm text-gray-500">{link.targetUrl}</p>

      <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
        <h2 className="mb-4 text-sm font-semibold text-gray-600">Click theo ngày</h2>
        {/* Suspense cho phép phần khung trang hiện ngay, chart stream vào sau khi query xong */}
        <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-gray-100" />}>
          <ClickStats linkId={link.id} />
        </Suspense>
      </div>
    </div>
  );
}
