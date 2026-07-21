import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-2xl font-bold">Không tìm thấy trang</h1>
      <p className="max-w-md text-sm text-gray-600">
        Link này có thể đã bị xoá, hoặc URL bạn nhập chưa đúng.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
