FROM node:14-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm i

RUN npm run build

ENV MODE PRODUCTION
EXPOSE 8080

CMD [ "node", "dist/src/server.js" ]
