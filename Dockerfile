FROM node:0.12.9

COPY . /app/

WORKDIR /app/
RUN ["apt-get", "update"]
RUN ["apt-get", "install", "libkrb5-dev"]
RUN ["npm", "install"]
#Install general packages
RUN ["npm", "install", "-g", "gulp", "browserify", "babel"]

RUN ["gulp", "prepare-client"]

CMD ["node","--harmony", "server/index.js"]
