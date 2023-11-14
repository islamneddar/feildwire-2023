# Base image
FROM node:20.8.1

WORKDIR /

COPY . .

ENV NODE_ENV production

RUN yarn build