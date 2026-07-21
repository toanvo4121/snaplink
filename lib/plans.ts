export const PLANS = {
  FREE: {
    name: 'Free',
    maxLinks: 5,
    price: 0,
  },
  PRO: {
    name: 'Pro',
    maxLinks: Infinity,
    price: 9,
    priceId: process.env.STRIPE_PRICE_ID_PRO,
  },
} as const;

export function planFor(status: 'FREE' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED') {
  // PAST_DUE vẫn tạm coi là Pro (grace period) để không đột ngột khoá tính năng
  // giữa chừng — tuỳ chính sách sản phẩm, có thể siết lại nếu muốn.
  return status === 'ACTIVE' || status === 'PAST_DUE' ? PLANS.PRO : PLANS.FREE;
}
