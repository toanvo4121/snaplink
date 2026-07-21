import { test, expect } from '@playwright/test';

async function loginAs(page: import('@playwright/test').Page, email: string) {
  await page.goto('/login');
  await page.getByPlaceholder('email test đã seed').fill(email);
  await page.getByRole('button', { name: 'Đăng nhập test (chỉ E2E)' }).click();
}

test('user thường bị chặn khỏi trang admin (dù gõ thẳng URL)', async ({ page }) => {
  await loginAs(page, 'user@snaplink.dev');
  await expect(page).toHaveURL(/\/dashboard/);

  // Cố tình truy cập thẳng route admin — đây chính là kịch bản mà middleware/proxy
  // đơn thuần có thể bị bypass (xem CVE-2025-29927); test này xác nhận requireAdmin()
  // ở tầng Server Component vẫn chặn đúng.
  await page.goto('/dashboard/admin');
  await expect(page.getByRole('heading', { name: 'Không tìm thấy trang' })).toBeVisible();
});

test('admin vào được trang quản trị và thấy danh sách user', async ({ page }) => {
  await loginAs(page, 'admin@snaplink.dev');
  await page.goto('/dashboard/admin');

  await expect(page.getByRole('heading', { name: 'Quản trị người dùng' })).toBeVisible();
  await expect(page.getByText('user@snaplink.dev')).toBeVisible();
});
