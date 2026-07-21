'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-2xl font-bold">Đã có lỗi xảy ra</h1>
      <p className="max-w-md text-sm text-gray-600">
        Đội ngũ kỹ thuật sẽ được thông báo. Bạn có thể thử lại thao tác vừa rồi.
      </p>
      {error.digest && <p className="text-xs text-gray-400">Mã lỗi: {error.digest}</p>}
      <button
        onClick={reset}
        className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
      >
        Thử lại
      </button>
    </div>
  );
}
