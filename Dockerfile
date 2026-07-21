# --- Stage 1: cài dependencies ---
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# --- Stage 2: build ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
# Biến env chỉ cần thiết LÚC BUILD để Next.js không lỗi khi đọc process.env tại build time.
# Giá trị thật sẽ được inject lúc chạy container (xem docker-compose.yml).
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000
RUN npm run build

# --- Stage 3: runtime — image nhỏ gọn nhờ output: 'standalone' trong next.config.ts ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
