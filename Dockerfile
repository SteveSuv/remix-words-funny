FROM node:22-alpine

WORKDIR /app

ADD build build
ADD package.json package.json
ADD node_modules node_modules
ADD .env .env

EXPOSE 3000
CMD ["npm", "start"]