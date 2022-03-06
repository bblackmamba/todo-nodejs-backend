FROM node:10.15.0-alpine
EXPOSE 3001

WORKDIR /home/app

COPY package.json /home/app/
COPY package-lock.json /home/app/

RUN npm i

RUN npm i express-swagger-generator --save-dev

COPY . /home/app

CMD ["node", "app.js" ]