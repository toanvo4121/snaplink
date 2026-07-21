'use server';

import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { requireUserOrThrow } from '@/lib/rbac';
import { PLANS } from '@/lib/plans';

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

/** Tạo phiên Stripe Checkout để user nâng cấp lên gói Pro */
export async function createCheckoutSession() {
  const user = await requireUserOrThrow();
  const dbUser = await db.user.findUniqueOrThrow({ where: { id: user.id } });

  let customerId = dbUser.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: dbUser.email,
      metadata: { userId: dbUser.id }, // để webhook map ngược lại User khi nhận event
    });
    customerId = customer.id;
    await db.user.update({ where: { id: dbUser.id }, data: { stripeCustomerId: customerId } });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: PLANS.PRO.priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/billing?success=1`,
    cancel_url: `${appUrl}/dashboard/billing?canceled=1`,
  });

  if (!checkoutSession.url) throw new Error('Không tạo được phiên thanh toán');
  redirect(checkoutSession.url);
}

/** Đưa user đã có subscription tới Stripe Customer Portal để tự quản lý (đổi thẻ, huỷ gói...) */
export async function createPortalSession() {
  const user = await requireUserOrThrow();
  const dbUser = await db.user.findUniqueOrThrow({ where: { id: user.id } });

  if (!dbUser.stripeCustomerId) throw new Error('Chưa có thông tin thanh toán');

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${appUrl}/dashboard/billing`,
  });

  redirect(portalSession.url);
}
