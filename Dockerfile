FROM oven/bun:1 AS builder

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# Dummy values so the env validator doesn't fail at build time
# Real values are injected at runtime via docker-compose environment
ENV DATABASE_URL=postgres://placeholder:placeholder@localhost:5432/placeholder
ENV ORIGIN=http://localhost:3000
ENV BETTER_AUTH_SECRET=placeholder
ENV RESEND_API_KEY=re_placeholder

RUN bun run build

FROM oven/bun:1 AS runner
WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["bun", "./build/index.js"]
