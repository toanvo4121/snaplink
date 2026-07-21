import type { Metadata } from 'next';
import { signIn } from '@/auth';

export const metadata: Metadata = { title: 'Đăng nhập' };

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-8">
      <h1 className="font-display text-xl font-bold">Đăng nhập Snaplink</h1>
      <p className="mt-1 text-sm text-gray-600">Miễn phí, không cần thẻ tín dụng.</p>

      <div className="mt-6 space-y-3">
        <form
          action={async () => {
            'use server';
            await signIn('google', { redirectTo: '/dashboard' });
          }}
        >
          <button className="w-full rounded-lg border border-[var(--color-border)] py-2.5 text-sm font-medium hover:bg-gray-50">
            Tiếp tục với Google
          </button>
        </form>

        <form
          action={async () => {
            'use server';
            await signIn('github', { redirectTo: '/dashboard' });
          }}
        >
          <button className="w-full rounded-lg border border-[var(--color-border)] py-2.5 text-sm font-medium hover:bg-gray-50">
            Tiếp tục với GitHub
          </button>
        </form>

        {process.env.E2E_TESTING === 'true' && (
          <form
            action={async (formData) => {
              'use server';
              await signIn('test-credentials', {
                email: formData.get('email'),
                redirectTo: '/dashboard',
              });
            }}
            className="border-t border-dashed border-[var(--color-border)] pt-3"
          >
            <input
              name="email"
              type="email"
              placeholder="email test đã seed"
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
            />
            <button className="mt-2 w-full rounded-lg bg-gray-800 py-2 text-sm font-medium text-white">
              Đăng nhập test (chỉ E2E)
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
