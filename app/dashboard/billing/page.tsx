import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/rbac';
import { planFor, PLANS } from '@/lib/plans';
import { createCheckoutSession, createPortalSession } from '@/app/actions/billing';

export const metadata: Metadata = { title: 'Gói & Thanh toán' };

export default async function BillingPage() {
  const user = await requireUser();
  const dbUser = await db.user.findUniqueOrThrow({ where: { id: user.id } });
  const plan = planFor(dbUser.planStatus);
  const isPro = plan.name === PLANS.PRO.name;

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl font-bold">Gói & Thanh toán</h1>

      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Gói hiện tại</p>
            <p className="font-display text-lg font-bold">{plan.name}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              dbUser.planStatus === 'ACTIVE'
                ? 'bg-green-100 text-green-700'
                : dbUser.planStatus === 'PAST_DUE'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-600'
            }`}
          >
            {dbUser.planStatus}
          </span>
        </div>

        {dbUser.stripeCurrentPeriodEnd && (
          <p className="mt-3 text-xs text-gray-500">
            Chu kỳ hiện tại kết thúc: {dbUser.stripeCurrentPeriodEnd.toLocaleDateString('vi-VN')}
          </p>
        )}

        <div className="mt-6">
          {isPro ? (
            <form action={createPortalSession}>
              <button className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium hover:bg-gray-50">
                Quản lý thanh toán
              </button>
            </form>
          ) : (
            <form action={createCheckoutSession}>
              <button className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]">
                Nâng cấp lên Pro — ${PLANS.PRO.price}/tháng
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
