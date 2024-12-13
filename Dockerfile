FROM node:20-alpine AS base

### Dependencies ###
FROM base AS deps
RUN apk add --no-cache libc6-compat git

# Setup npm environment
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/
RUN npm ci

# Builder
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . . 
RUN npm run build

### Production image runner ###
FROM base AS runner

# Set NODE_ENV to production
ENV NODE_ENV production

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Set correct permissions for nextjs user and don't run as root
RUN addgroup nodejs
RUN adduser -SDH nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy application files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./ 
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copie o script de inicialização para o container
COPY start.sh /app/start.sh

# Execute chmod como root antes de mudar para nextjs
USER root
RUN chmod +x /app/start.sh

# Mude de volta para o usuário 'nextjs'
USER nextjs

# Exposed port (for orchestrators and dynamic reverse proxies)
EXPOSE 80
ENV PORT 80
ENV HOSTNAME "0.0.0.0"

# Run the application
CMD ["/app/start.sh"]
