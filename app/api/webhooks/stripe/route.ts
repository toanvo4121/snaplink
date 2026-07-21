import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

/**
 * Webhook Stripe — đây là NGUỒN SỰ THẬT duy nhất để cập nhật trạng thái
 * subscription. Không bao giờ set planStatus = ACTIVE ngay sau khi redirect
 * về success_url ở client, vì thanh toán có thể fail sau đó (thẻ bị từ chối
 * async, 3D-Secure...). Luôn chờ webhook xác nhận từ Stripe.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Thiếu chữ ký' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Stripe webhook signature verification failed', err);
    return NextResponse.json({ error: 'Chữ ký không hợp lệ' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      await db.user.update({
        where: { stripeCustomerId: session.customer as string },
        data: {
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price.id,
          stripeCurrentPeriodEnd: new Date(subscription.items.data[0]!.current_period_end * 1000),
          planStatus: 'ACTIVE',
        },
      });
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        await db.user.update({
          where: { stripeCustomerId: invoice.customer as string },
          data: {
            planStatus: 'ACTIVE',
            stripeCurrentPeriodEnd: new Date(subscription.items.data[0]!.current_period_end * 1000),
          },
        });
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      await db.user.update({
        where: { stripeCustomerId: invoice.customer as string },
        data: { planStatus: 'PAST_DUE' },
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await db.user.update({
        where: { stripeCustomerId: subscription.customer as string },
        data: { planStatus: 'CANCELED', stripeSubscriptionId: null },
      });
      break;
    }

    default:
      // Bỏ qua các event type khác — chỉ log để dễ debug, không throw
      console.log(`Bỏ qua Stripe event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
