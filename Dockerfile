FROM node:22-alpine AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat git

ENV NPM_HOME="/npm"
ENV PATH="$NPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare npm@latest --activate

WORKDIR /app

COPY package.json npm-lock.yaml ./
RUN npm install --frozen-lockfile --prefer-frozen-lockfile

FROM base AS builder

RUN corepack enable
RUN corepack prepare npm@latest --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner

ENV NODE_ENV production

ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup nodejs
RUN adduser -SDH nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 80
ENV PORT 80
ENV HOSTNAME "0.0.0.0"
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "wget", "-q0", "http://localhost:80/health" ]

CMD ["node", "server.js"]
