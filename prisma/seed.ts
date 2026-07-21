/**
 * Seed dữ liệu mẫu cho môi trường dev/test.
 * Chạy: npm run db:seed
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@snaplink.dev' },
    update: {},
    create: {
      email: 'admin@snaplink.dev',
      name: 'Admin Demo',
      role: 'ADMIN',
      planStatus: 'ACTIVE',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@snaplink.dev' },
    update: {},
    create: {
      email: 'user@snaplink.dev',
      name: 'Người dùng Demo',
      role: 'USER',
      planStatus: 'FREE',
    },
  });

  await prisma.link.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      slug: 'demo',
      targetUrl: 'https://nextjs.org',
      title: 'Next.js — demo link',
      userId: user.id,
      clicks: { create: [{ country: 'VN' }, { country: 'US' }, { country: 'VN' }] },
    },
  });

  console.log('✅ Seed xong:', { admin: admin.email, user: user.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
