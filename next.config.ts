import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Bật mô hình caching mới của Next.js 16: mặc định dynamic, cache tường minh qua "use cache"
  cacheComponents: true,

  // Build ra bundle standalone gọn nhẹ để đóng Docker image (xem Dockerfile)
  output: 'standalone',

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // avatar Google OAuth
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' }, // avatar GitHub OAuth
    ],
  },

  async headers() {
    return [
      {
        // Security headers cơ bản áp dụng toàn site (xem mục 8 trong tài liệu security)
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; frame-src https://js.stripe.com; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.stripe.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
