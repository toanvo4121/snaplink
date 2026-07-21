import type { Metadata } from 'next';
import { Sora, Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', weight: ['600', '700'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

// Metadata mặc định — mọi page con có thể override qua `export const metadata`
// hoặc `generateMetadata()` riêng.
export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: { default: 'Snaplink — Rút gọn link, đo lường click', template: '%s · Snaplink' },
  description: 'Rút gọn link nhanh, theo dõi click theo thời gian thực. Miễn phí cho 5 link đầu tiên.',
  openGraph: {
    type: 'website',
    siteName: 'Snaplink',
    locale: 'vi_VN',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
