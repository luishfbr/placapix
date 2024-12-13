FROM node:22-slim

WORKDIR /app

# Copiar apenas os arquivos necessários para instalação de dependências
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código e gerar o build
COPY . .
RUN npm run build

# Mover para standalone para otimização
RUN mv /app/.next/standalone /standalone && mv /app/.next/static /standalone/static

# Configurar a imagem final para execução
WORKDIR /standalone
EXPOSE 80
CMD ["node", "server.js"]
