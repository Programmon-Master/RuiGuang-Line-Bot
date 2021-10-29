FROM node:16-stretch
WORKDIR /usr/src/app

COPY ./ ./

RUN npm install
EXPOSE 5000

CMD [ "node", "server.js" ]