'use client';

import { useActionState } from 'react';
import { createLink, type ActionState } from '@/app/actions/links';

const initialState: ActionState = {};

export function LinkForm() {
  const [state, formAction, isPending] = useActionState(createLink, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
      <div className="flex-1 min-w-[200px]">
        <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="targetUrl">
          URL cần rút gọn
        </label>
        <input
          id="targetUrl"
          name="targetUrl"
          type="url"
          required
          placeholder="https://example.com/bai-viet-rat-dai"
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
        />
      </div>
      <div className="w-40">
        <label className="mb-1 block text-xs font-medium text-gray-600" htmlFor="slug">
          Slug (tuỳ chọn)
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          placeholder="tự sinh"
          className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
      >
        {isPending ? 'Đang tạo...' : 'Tạo link'}
      </button>
      {state.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
