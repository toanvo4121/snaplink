import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  // Fail sớm & rõ ràng thay vì lỗi mơ hồ lúc gọi API — giúp debug nhanh khi deploy thiếu env
  throw new Error('Thiếu biến môi trường STRIPE_SECRET_KEY');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
});
