FROM node:14
WORKDIR /usr/src/app

COPY . .
RUN npm install

EXPOSE 8000
CMD [ "npm", "run", "start" ]