# The builder from node image
FROM node:alpine as builder

# build-time variables 
# prod|sandbox its value will be come from outside 

RUN apk update && apk add --no-cache make git

# Move our files into directory name "app"
WORKDIR /frontend
COPY package.json package-lock.json  /frontend/
RUN npm install @angular/cli@6.0.8 -g
RUN cd /frontend && npm install
COPY .  /frontend

RUN cd /frontend && npm run build

