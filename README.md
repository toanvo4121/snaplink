# Snaplink

SaaS mini rút gọn link kèm thống kê click — dự án minh hoạ kiến trúc Next.js 16 đầy đủ:
Auth.js (OAuth), dashboard đa vai trò (USER/ADMIN), thanh toán Stripe, cache/ISR cho trang
công khai, Server Actions cho toàn bộ mutation, SEO, E2E test, và deploy production.

> Đây là dự án **tham khảo kiến trúc**, không phải sản phẩm hoàn chỉnh để bán. Trước khi
> dùng thật, xem lại phần "Việc cần làm thêm cho production" ở cuối file.

## Kiến trúc & vì sao chọn vậy

| Quyết định | Lý do |
|---|---|
| App Router (không Pages Router) | Bắt buộc để dùng Server Components, Server Actions, Cache Components — toàn bộ tính năng mới của Next 16 |
| Auth.js v5, tách `auth.config.ts` / `auth.ts` | `proxy.ts` chạy Edge Runtime, không import được Prisma adapter → phải tách config "nhẹ" (edge-safe) khỏi config "đầy đủ" (Node-only) |
| `requireUser()`/`requireAdmin()` gọi lại ở mọi Server Component/Action | Middleware/proxy **không phải** lớp bảo mật duy nhất (bài học từ CVE-2025-29927 — bypass middleware bằng header giả) |
| Cache Components (`"use cache"`) cho trang public, dynamic mặc định cho dashboard | Mô hình caching mới của Next 16: tường minh, không còn cache ngầm định khó đoán như Next 14/15 |
| Stripe: cập nhật DB qua webhook, không qua `success_url` | Thanh toán có thể fail sau khi redirect (3D-Secure, thẻ bị từ chối async) — webhook là nguồn sự thật duy nhất |
| Credentials provider riêng cho E2E (`E2E_TESTING=true`) | OAuth Google/GitHub thật không tự động hoá được trong Playwright mà không mock phức tạp |

## Chạy local

### 1. Cài đặt

```bash
npm install
cp .env.example .env
```

Điền vào `.env`:
- `DATABASE_URL` — Postgres local hoặc [Neon](https://neon.tech)/[Supabase](https://supabase.com) free tier
- `AUTH_SECRET` — chạy `npx auth secret` để tự sinh
- `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET` — tạo tại [Google Cloud Console](https://console.cloud.google.com/apis/credentials), redirect URI: `http://localhost:3000/api/auth/callback/google`
- `AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET` — tạo tại GitHub → Settings → Developer settings → OAuth Apps, callback URL: `http://localhost:3000/api/auth/callback/github`
- `STRIPE_SECRET_KEY` — lấy ở Stripe Dashboard (dùng key `sk_test_...` khi dev)
- `STRIPE_PRICE_ID_PRO` — tạo 1 Product + Price (recurring, monthly) trong Stripe Dashboard, copy Price ID

### 2. Khởi tạo database

```bash
npm run db:push   # tạo bảng theo prisma/schema.prisma
npm run db:seed   # tạo user demo: admin@snaplink.dev, user@snaplink.dev + 1 link mẫu
```

### 3. Lắng nghe Stripe webhook (local)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# copy "whsec_..." được in ra vào STRIPE_WEBHOOK_SECRET trong .env
```

### 4. Chạy dev server

```bash
npm run dev
```

Mở `http://localhost:3000`. Vì chưa đăng nhập thật bằng OAuth ở local dễ dàng, có thể bật
tạm `E2E_TESTING=true` trong `.env` để hiện form "Đăng nhập test" ở `/login` (dùng email đã seed).
**Nhớ tắt lại trước khi deploy** — provider này bỏ qua xác thực mật khẩu.

## Chạy E2E test

```bash
npm run test:e2e
```

`playwright.config.ts` tự khởi động `next dev` khi chạy local. Test dùng credentials
provider test-only (xem `auth.ts`), không cần OAuth thật.

## Deploy

### Cách A — Vercel (khuyến nghị, ít việc nhất)

1. Push code lên GitHub, import repo vào [Vercel](https://vercel.com/new).
2. Thêm toàn bộ biến môi trường trong `.env.example` vào Vercel Project Settings
   (production values — **không** set `E2E_TESTING`).
3. Dùng Postgres managed (Vercel Postgres, Neon, Supabase...) cho `DATABASE_URL`.
4. Sau khi deploy, cập nhật `AUTH_URL`/`NEXT_PUBLIC_APP_URL` = domain thật, và thêm
   redirect URI thật vào Google/GitHub OAuth app.
5. Tạo webhook endpoint trong Stripe Dashboard trỏ về
   `https://your-domain.com/api/webhooks/stripe`, copy signing secret vào
   `STRIPE_WEBHOOK_SECRET`.
6. Mỗi PR tự có preview deployment; merge vào `main` tự deploy production
   (GitHub integration mặc định của Vercel — không cần cấu hình thêm trong `ci.yml`).

### Cách B — Tự host bằng Docker

```bash
cp .env.example .env   # điền giá trị thật
docker compose up -d --build
npx prisma db push     # chạy 1 lần để tạo bảng trong container Postgres
```

App chạy ở `http://localhost:3000`, Postgres ở `localhost:5432`. Dockerfile dùng
`output: 'standalone'` (đã bật trong `next.config.ts`) nên image runtime rất gọn,
không kèm `node_modules` thừa.

Đứng sau reverse proxy thật (Nginx/Caddy) để có HTTPS khi deploy production.

## CI/CD

`.github/workflows/ci.yml` chạy trên mỗi PR và push vào `main`:
1. `lint-and-typecheck` — ESLint + `tsc --noEmit`
2. `e2e` — dựng Postgres tạm, seed, build, chạy Playwright, upload report nếu fail

Deploy thật giao cho Vercel's GitHub integration (tự động, không cần job riêng). Nếu
tự host, thêm job `deploy` build & push Docker image tới registry của bạn.

## Cấu trúc thư mục

```
app/
  (marketing)/        # landing, pricing, blog — có Navbar/Footer, cache tĩnh
  (auth)/login/        # trang đăng nhập
  dashboard/            # khu vực cần đăng nhập — layout gọi requireUser()
    admin/               # chỉ ADMIN — page gọi requireAdmin()
    billing/             # tích hợp Stripe Checkout/Portal
    links/[id]/           # chi tiết link + biểu đồ click (Suspense streaming)
  api/auth/[...nextauth]/ # Auth.js handler
  api/webhooks/stripe/     # đồng bộ trạng thái subscription
  r/[slug]/                 # redirect handler công khai, ghi nhận click
  actions/                   # toàn bộ Server Actions (links/billing/admin)
lib/                          # db, stripe, rbac, validations, plans — logic dùng chung
components/                    # UI components, tách theo domain
e2e/                             # Playwright test cho 3 luồng chính
prisma/schema.prisma              # data model
```

## Việc cần làm thêm cho production

Dự án này ưu tiên minh hoạ kiến trúc rõ ràng hơn là phủ hết mọi trường hợp biên. Trước khi
dùng thật, cân nhắc bổ sung:
- Rate limiting cho Server Actions nhạy cảm (đặc biệt `createLink`, login) — VD Upstash Ratelimit.
- Email xác thực / thông báo (mời thành viên, cảnh báo thanh toán thất bại).
- Test coverage rộng hơn (unit test cho `lib/`, không chỉ E2E).
- Audit log cho hành động admin (đổi role, xoá user) — hiện chỉ ghi vào DB, chưa có lịch sử.
- Xử lý đa tenant/team nếu sản phẩm thật cần nhiều người dùng chung 1 workspace.
