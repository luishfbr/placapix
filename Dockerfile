FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN npx prisma migrate dev --name init

RUN npx prisma generate

RUN npm run build

COPY . .

EXPOSE 80

CMD ["npm", "start"]
