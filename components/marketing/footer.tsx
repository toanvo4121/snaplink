"use client";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-8">
      <div className="mx-auto max-w-5xl px-6 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Snaplink. Dự án minh hoạ kiến trúc Next.js.</p>
      </div>
    </footer>
  );
}
