'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { deleteLink } from '@/app/actions/links';

type LinkRow = {
  id: string;
  slug: string;
  targetUrl: string;
  title: string | null;
  _count: { clicks: number };
};

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export function LinksTable({ links }: { links: LinkRow[] }) {
  const [isPending, startTransition] = useTransition();

  if (links.length === 0) {
    return <p className="mt-6 text-sm text-gray-500">Chưa có link nào. Tạo link đầu tiên ở trên.</p>;
  }

  return (
    <table className="mt-6 w-full text-sm">
      <thead>
        <tr className="border-b border-[var(--color-border)] text-left text-gray-500">
          <th className="pb-2 font-medium">Link</th>
          <th className="pb-2 font-medium">Đích đến</th>
          <th className="pb-2 font-medium">Click</th>
          <th className="pb-2 font-medium"></th>
        </tr>
      </thead>
      <tbody>
        {links.map((link) => (
          <tr key={link.id} className="border-b border-[var(--color-border)]">
            <td className="py-3">
              <Link href={`/dashboard/links/${link.id}`} className="font-medium text-[var(--color-accent)]">
                {appUrl.replace(/^https?:\/\//, '')}/r/{link.slug}
              </Link>
            </td>
            <td className="max-w-[240px] truncate py-3 text-gray-500">{link.targetUrl}</td>
            <td className="py-3">{link._count.clicks}</td>
            <td className="py-3 text-right">
              <button
                disabled={isPending}
                onClick={() => {
                  if (confirm('Xoá link này? Hành động không thể hoàn tác.')) {
                    startTransition(() => deleteLink(link.id));
                  }
                }}
                className="text-xs text-red-600 hover:underline disabled:opacity-50"
              >
                Xoá
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
