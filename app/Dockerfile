FROM node:18-alpine

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

RUN mkdir -p /home/app

COPY package*.json /home/app/

WORKDIR /home/app

RUN npm install

COPY . /home/app

CMD [ "node", "server.js" ]