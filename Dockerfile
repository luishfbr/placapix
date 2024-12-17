# Etapa 1: Build
FROM node:18-alpine AS builder

# Definir diretório de trabalho no container
WORKDIR /app

# Copiar apenas os arquivos necessários para instalação
COPY package.json package-lock.json ./ 

# Instalar dependências
RUN npm install

# Copiar o restante do código da aplicação
COPY . .

# Construir o projeto Next.js
RUN npm run build

# Etapa 2: Run (Imagem final)
FROM node:18-alpine

# Definir diretório de trabalho no container
WORKDIR /app

# Copiar arquivos da etapa anterior
COPY --from=builder /app/.next .next
COPY --from=builder /app/package.json .

# Instalar apenas dependências de produção
RUN npm install --production

# Expor a porta 3000
EXPOSE 80

# Comando para iniciar o servidor
CMD ["npm", "start"]
