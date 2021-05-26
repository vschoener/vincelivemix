#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:16.2.0 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
RUN npm ci --quiet && npm run build

#
# Build Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM node:16.2.0-alpine as production-builder

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --quiet --only=production

FROM node:16.2.0-alpine as production

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
## We just need the dist folder and node_modules to execute the command
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=production-builder /app/node_modules ./node_modules
