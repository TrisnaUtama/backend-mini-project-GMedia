FROM node:20-slim

RUN apt-get update && apt-get install -y netcat-openbsd git

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start:dev"]