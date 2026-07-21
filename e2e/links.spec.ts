import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('email test đã seed').fill('user@snaplink.dev');
  await page.getByRole('button', { name: 'Đăng nhập test (chỉ E2E)' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
});

test('tạo link mới rồi xoá', async ({ page }) => {
  const slug = `e2e-${Date.now()}`;

  await page.getByLabel('URL cần rút gọn').fill('https://example.com/trang-dai');
  await page.getByLabel('Slug (tuỳ chọn)').fill(slug);
  await page.getByRole('button', { name: 'Tạo link' }).click();

  const row = page.getByText(new RegExp(`/r/${slug}$`));
  await expect(row).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept()); // xác nhận confirm() khi xoá
  await page
    .locator('tr', { has: row })
    .getByRole('button', { name: 'Xoá' })
    .click();

  await expect(row).not.toBeVisible();
});

test('không cho tạo slug trùng', async ({ page }) => {
  await page.getByLabel('URL cần rút gọn').fill('https://example.com/1');
  await page.getByLabel('Slug (tuỳ chọn)').fill('demo'); // slug 'demo' đã có sẵn từ seed
  await page.getByRole('button', { name: 'Tạo link' }).click();

  await expect(page.getByText(/đã được dùng/)).toBeVisible();
});
