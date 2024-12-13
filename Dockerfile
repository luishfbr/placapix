# Usar a imagem base do node
FROM node:20-alpine AS base

### Dependencies ###
FROM base AS deps
RUN apk add --no-cache libc6-compat git

WORKDIR /app

# Copiar os arquivos de dependências (package.json, tsconfig.json, prisma)
COPY package*.json tsconfig.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

# Builder: Compilação do projeto
FROM base AS builder

WORKDIR /app

# Copiar as dependências instaladas na camada anterior
COPY --from=deps /app/node_modules ./node_modules
# Copiar os outros arquivos necessários para o build
COPY . . 

# Construir o projeto Next.js
RUN npm run build

### Produção ###
FROM base AS runner

# Definir o ambiente como produção
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Criação de usuário e grupo para evitar rodar como root
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Criar diretórios e dar permissão
RUN mkdir .next && chown nextjs:nodejs .next

# Copiar o build gerado no estágio anterior
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copiar o script de inicialização
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Definir o usuário para execução do contêiner
USER nextjs

# Expor a porta
EXPOSE 80
ENV PORT 80
ENV HOSTNAME "0.0.0.0"

# Comando de inicialização
CMD ["/app/start.sh"]
