# Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# TODO: Maybe revisit this, as we probably shouldn***REMOVED***t be relying on
# legacy-peer-deps
COPY .npmrc ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:20-alpine AS builder

# RUN apk --no-cache add curl
WORKDIR /app
COPY package.json package-lock.json ./
COPY public  public
COPY index.html index.html
COPY src  src
COPY .eslintrc.json vite.config.ts vite-env.d.ts tailwind.config.js tsconfig.json tsconfig.paths.json ./
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files and run vite
FROM nginx:1.25.1 AS nginx
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist/ /usr/share/nginx/html

COPY ./docker/nginx/conf.d/* /etc/nginx/conf.d/

EXPOSE 80
