FROM node:22-alpine

WORKDIR /app

COPY package*.json tsconfig.json ./
COPY prisma ./prisma/

RUN npm install 

COPY . . 

RUN npm run build

EXPOSE 80

ENV HOSTNAME "0.0.0.0"

CMD ["npm", "run", "start"]