# Dockerfile for production only

# Installing stage
FROM node:latest as installer
ENV NODE_ENV=production
WORKDIR /app
# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package*.json ./
RUN npm install --quiet

# Building stage
FROM node:latest as builder
WORKDIR /app
COPY --from=installer /app .
COPY ../src src
COPY tsconfig*.json ./
RUN npm run build

# Running stage
FROM node:latest as run
WORKDIR /app
COPY --from=builder /app .
CMD [ "npm", "start" ]
