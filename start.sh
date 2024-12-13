#!/bin/sh

# Execute as migrações do Prisma
npx prisma migrate dev --env .env
npx prisma generate

# Inicie o servidor Next.js
node server.js
