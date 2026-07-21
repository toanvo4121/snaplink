import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * Đây PHẢI là route dynamic (không cache) vì mỗi lượt truy cập cần ghi nhận
 * click mới. Route Handler (thay vì page.tsx) vì không cần render HTML —
 * chỉ ghi log rồi redirect ngay, giảm 1 round-trip so với việc render trang
 * trung gian.
 */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // params là Promise kể từ Next.js 15+

  const link = await db.link.findUnique({ where: { slug } });
  if (!link) {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  // Ghi nhận click bất đồng bộ — không await để không làm chậm redirect tới user
  const country = request.headers.get('x-vercel-ip-country') ?? undefined;
  db.click.create({ data: { linkId: link.id, country } }).catch((err) => {
    console.error('Không ghi được click:', err);
  });

  return NextResponse.redirect(link.targetUrl, { status: 307 });
}
