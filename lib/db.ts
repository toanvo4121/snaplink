import { PrismaClient } from '@prisma/client';

// Next.js dev mode hot-reload module — nếu không cache instance ở globalThis,
// mỗi lần save file sẽ tạo thêm 1 kết nối DB mới cho tới khi hết pool.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
