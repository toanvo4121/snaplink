import Link from 'next/link';
import type { Metadata } from 'next';
import { PLANS } from '@/lib/plans';

export const metadata: Metadata = {
  title: 'Bảng giá',
  description: 'Bắt đầu miễn phí, nâng cấp lên Pro khi cần nhiều link hơn.',
};

export default async function PricingPage() {
  'use cache';

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="font-display text-3xl font-bold">Bảng giá đơn giản</h1>
      <p className="mt-2 text-gray-600">Không phí ẩn. Huỷ bất cứ lúc nào.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-8">
          <h2 className="font-display text-xl font-bold">{PLANS.FREE.name}</h2>
          <p className="mt-2 text-3xl font-bold">0₫</p>
          <ul className="mt-6 space-y-2 text-sm text-gray-600">
            <li>✓ Tối đa {PLANS.FREE.maxLinks} link</li>
            <li>✓ Thống kê click cơ bản</li>
          </ul>
          <Link
            href="/login"
            className="mt-8 block rounded-lg border border-[var(--color-border)] py-2 text-center font-medium hover:bg-white"
          >
            Bắt đầu miễn phí
          </Link>
        </div>

        <div className="rounded-2xl border-2 border-[var(--color-accent)] bg-[var(--color-surface-raised)] p-8">
          <h2 className="font-display text-xl font-bold">{PLANS.PRO.name}</h2>
          <p className="mt-2 text-3xl font-bold">${PLANS.PRO.price}/tháng</p>
          <ul className="mt-6 space-y-2 text-sm text-gray-600">
            <li>✓ Link không giới hạn</li>
            <li>✓ Thống kê click nâng cao</li>
            <li>✓ Hỗ trợ ưu tiên</li>
          </ul>
          <Link
            href="/dashboard/billing"
            className="mt-8 block rounded-lg bg-[var(--color-accent)] py-2 text-center font-medium text-white hover:bg-[var(--color-accent-hover)]"
          >
            Nâng cấp lên Pro
          </Link>
        </div>
      </div>
    </section>
  );
}
