FROM node:8-alpine

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm i --production

COPY . .

CMD node server.js
