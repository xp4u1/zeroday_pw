# BUILD STAGE

FROM node:22-alpine AS builder

ENV DATABASE_URL=postgresql://dummy:password@postgres.local/database
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache cmake

WORKDIR /app
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm build
RUN pnpm drizzle-kit export > build/init.sql

# PRODUCTION STAGE

FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache helm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY --from=builder /app/kubernetes ./kubernetes
COPY --from=builder /app/build ./build
COPY --from=builder /app/scripts ./scripts

EXPOSE 3000

CMD ["node", "build/index.js"]
