FROM node:22-slim

WORKDIR /app

# Copiar todos os arquivos do projeto
COPY . .

# Instalar dependências
RUN npm install

# Construir o projeto
RUN npm run build

# Expor a porta para o servidor
EXPOSE 80

# Comando para iniciar o servidor
CMD ["npm", "start"]
