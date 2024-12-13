FROM node:latest

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

ENV HOSTNAME="0.0.0.0"

EXPOSE 80

CMD ["npm", "run", "start"]
