import Link from 'next/link';
import { auth, signOut } from '@/auth';

// Server Component — đọc session trực tiếp bằng auth(), không cần useSession()
// vì không có tương tác client (trừ nút đăng xuất bên dưới dùng Server Action).
export async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-bold">
          Snaplink
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/pricing" className="text-gray-600 hover:text-[var(--color-ink)]">
            Bảng giá
          </Link>
          <Link href="/blog" className="text-gray-600 hover:text-[var(--color-ink)]">
            Blog
          </Link>
          {session?.user ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-[var(--color-ink)]">
                Dashboard
              </Link>
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/' });
                }}
              >
                <button className="rounded-lg bg-[var(--color-accent)] px-4 py-2 font-medium text-white hover:bg-[var(--color-accent-hover)]">
                  Đăng xuất
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-[var(--color-accent)] px-4 py-2 font-medium text-white hover:bg-[var(--color-accent-hover)]"
            >
              Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
