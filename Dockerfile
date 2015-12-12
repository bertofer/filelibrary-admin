FROM node:0.12.9

COPY . /app/

WORKDIR /app/

RUN ["npm", "install"]
#Install general packages
RUN ["npm", "install", "-g", "gulp", "browserify", "babel"]

RUN ["gulp", "prepare-client"]

CMD ["node", "server/index.js"]
EXPOSE ${APP_PORT}
