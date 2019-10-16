# Installing stage
FROM node:latest as installer
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package*.json ./
RUN npm install --quiet

# Building stage
FROM node:latest as builder
WORKDIR /app
COPY --from=installer /app .
COPY ./src src
COPY tsconfig*.json ./
RUN npm run build

# Running stage
FROM node:latest as run
WORKDIR /app
COPY --from=builder /app .
CMD [ "npm", "start" ]

FROM node:latest as development
WORKDIR /app
COPY --from=builder /app .
## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.6.0/wait /usr/local/bin/wait
RUN chmod +x /usr/local/bin/wait
