import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/rbac';
import { updateUserRole, deleteUser } from '@/app/actions/admin';

export const metadata: Metadata = { title: 'Quản trị' };

export default async function AdminPage() {
  const admin = await requireAdmin(); // ← chặn 404 nếu không phải ADMIN, kể cả khi cố truy cập thẳng URL

  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { links: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Quản trị người dùng</h1>
      <p className="mt-1 text-sm text-gray-500">{users.length} người dùng</p>

      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-left text-gray-500">
            <th className="pb-2 font-medium">Email</th>
            <th className="pb-2 font-medium">Vai trò</th>
            <th className="pb-2 font-medium">Gói</th>
            <th className="pb-2 font-medium">Số link</th>
            <th className="pb-2 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-[var(--color-border)]">
              <td className="py-3">{u.email}</td>
              <td className="py-3">
                <form action={updateUserRole} className="flex items-center gap-2">
                  <input type="hidden" name="userId" value={u.id} />
                  <select
                    name="role"
                    defaultValue={u.role}
                    disabled={u.id === admin.id}
                    className="rounded border border-[var(--color-border)] px-2 py-1 text-xs disabled:opacity-50"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <button type="submit" className="text-xs text-[var(--color-accent)] hover:underline">
                    Lưu
                  </button>
                </form>
              </td>
              <td className="py-3">{u.planStatus}</td>
              <td className="py-3">{u._count.links}</td>
              <td className="py-3 text-right">
                {u.id !== admin.id && (
                  <form action={deleteUser.bind(null, u.id)}>
                    <button className="text-xs text-red-600 hover:underline">Xoá</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
