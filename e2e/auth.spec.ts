import { test, expect } from '@playwright/test';

// Dùng provider "test-credentials" (chỉ bật khi E2E_TESTING=true) để bỏ qua
// OAuth thật — xem giải thích trong auth.ts. Email phải khớp user đã seed
// (prisma/seed.ts): user@snaplink.dev.
async function loginAs(page: import('@playwright/test').Page, email: string) {
  await page.goto('/login');
  await page.getByPlaceholder('email test đã seed').fill(email);
  await page.getByRole('button', { name: 'Đăng nhập test (chỉ E2E)' }).click();
}

test.describe('Đăng nhập', () => {
  test('người chưa đăng nhập bị redirect khỏi /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('đăng nhập thành công và vào được dashboard', async ({ page }) => {
    await loginAs(page, 'user@snaplink.dev');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Link của tôi' })).toBeVisible();
  });
});
