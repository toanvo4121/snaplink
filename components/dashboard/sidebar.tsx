import Link from 'next/link';

export function Sidebar({ role }: { role: 'USER' | 'ADMIN' }) {
  const links = [
    { href: '/dashboard', label: 'Link của tôi' },
    { href: '/dashboard/billing', label: 'Gói & Thanh toán' },
    ...(role === 'ADMIN' ? [{ href: '/dashboard/admin', label: 'Quản trị' }] : []),
  ];

  return (
    <aside className="w-56 shrink-0 border-r border-[var(--color-border)] p-4">
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
