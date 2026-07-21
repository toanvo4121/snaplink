import Link from 'next/link';
import type { Metadata } from 'next';
import { cacheLife as cacheLife } from 'next/cache';

export const metadata: Metadata = {
  title: 'Rút gọn link, đo lường click theo thời gian thực',
};

// Nội dung landing page không đổi theo từng request → cache tĩnh.
// cacheLife('hours'): dùng profile dựng sẵn — trả cache ngay trong vài giờ đầu,
// sau đó tự làm mới ngầm — phù hợp trang marketing ít khi đổi nội dung.
// (API còn tiền tố unstable_ ở thời điểm viết tài liệu này — kiểm tra changelog
// Next.js khi nâng cấp, có thể đã ổn định thành `cacheLife` không tiền tố.)
async function LandingContent() {
  'use cache';
  cacheLife('hours');

  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="max-w-2xl">
        <p className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--color-accent)]">
          Miễn phí cho 5 link đầu tiên
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
          Một link ngắn.
          <br />
          Mọi số liệu bạn cần.
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Snaplink rút gọn URL trong 1 giây và theo dõi từng click theo thời gian thực —
          không cần cấu hình Google Analytics phức tạp.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-[var(--color-accent)] px-6 py-3 font-medium text-white hover:bg-[var(--color-accent-hover)]"
          >
            Bắt đầu miễn phí
          </Link>
          <Link
            href="/pricing"
            className="rounded-lg border border-[var(--color-border)] px-6 py-3 font-medium hover:bg-white"
          >
            Xem bảng giá
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return <LandingContent />;
}
