import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  // Fail sớm & rõ ràng thay vì lỗi mơ hồ lúc gọi API — giúp debug nhanh khi deploy thiếu env
  throw new Error('Thiếu biến môi trường STRIPE_SECRET_KEY');
}

/**
 * ⚠️ Lưu ý khi bump version gói `stripe`:
 * Theo Stripe, type TypeScript của stripe-node LUÔN phản ánh phiên bản API MỚI NHẤT
 * mà chính bản SDK đó hỗ trợ — KHÔNG phải version bạn truyền vào `apiVersion` dưới đây.
 * Vì vậy nếu bump SDK lên major mới, phải kiểm tra lại chuỗi apiVersion này cho khớp
 * (xem CHANGELOG.md của stripe-node, hoặc `cat node_modules/stripe/OPENAPI_VERSION`),
 * nếu không response thực tế lúc runtime có thể không khớp với type lúc code.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-06-24.dahlia',
  typescript: true,
});

/**
 * Lấy ngày kết thúc chu kỳ billing hiện tại — AN TOÀN qua các version API.
 *
 * Từ API version 2025-03-31.basil, Stripe chuyển `current_period_start`/`current_period_end`
 * từ cấp Subscription XUỐNG từng SubscriptionItem (vì 1 subscription có thể có nhiều
 * item với chu kỳ billing khác nhau — "mixed interval"). Đây là lý do gây lỗi
 * "Property 'current_period_end' does not exist" nếu package `stripe` cài đặt là bản
 * cũ hơn thời điểm đó. Với subscription 1-price đơn giản như ở Snaplink, luôn lấy từ
 * item đầu tiên.
 */
export function getCurrentPeriodEnd(subscription: Stripe.Subscription): Date {
  const item = subscription.items.data[0];
  if (!item) throw new Error('Subscription không có item nào để đọc chu kỳ billing');
  return new Date(item.current_period_end * 1000);
}

/**
 * Lấy subscription ID từ Invoice — AN TOÀN qua các version API.
 *
 * Từ API version 2025-03-31.basil, field `invoice.subscription` bị loại bỏ, thay bằng
 * `invoice.parent.subscription_details.subscription` (Stripe gộp chung các nguồn gốc
 * có thể sinh ra invoice — subscription, quote... — vào 1 field `parent` polymorphic).
 */
export function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  if (invoice.parent?.type !== 'subscription_details') return null;
  const sub = invoice.parent.subscription_details?.subscription;
  if (!sub) return null;
  return typeof sub === 'string' ? sub : sub.id;
}
