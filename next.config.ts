import type { NextConfig } from "next";
import path from "node:path";

const isDev = process.env.NODE_ENV === "development";

const csp = `
default-src 'self';
script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://js.stripe.com;
frame-src https://js.stripe.com;
img-src 'self' https: data:;
style-src 'self' 'unsafe-inline';
connect-src 'self' https://api.stripe.com ${isDev ? "ws: wss:" : ""};
`
  .replace(/\s+/g, " ")
  .trim();

const nextConfig: NextConfig = {
  cacheComponents: true,

  output: "standalone",

  turbopack: {
    root: path.resolve(__dirname),
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;