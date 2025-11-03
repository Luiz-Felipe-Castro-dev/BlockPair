# syntax=docker/dockerfile:1

# ---- deps ----
FROM node:lts-alpine3.17 AS deps
WORKDIR /usr/src/app

# Install deps (with dev deps for tsc)
COPY package.json package-lock.json ./
RUN npm ci

# ---- build (compile TS via dev2) ----
FROM deps AS build
WORKDIR /usr/src/app

# Bring in source (expects tsconfig.json and your .ts files, e.g. app.ts or src/**)
COPY . .

# dev2 should run the TypeScript compiler (see scripts snippet below)
RUN npm run dev2

# ---- runtime ----
FROM node:lts-alpine3.17 AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

# # Prisma needs openssl on Alpine
# RUN apk add --no-cache openssl

# Install only prod deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy compiled JS and Prisma schema
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma

# Generate Prisma client against prod node_modules
RUN npx prisma generate

EXPOSE 3000

# Run migrations, then start compiled app
CMD ["sh", "-c", "npm run db:deploy && node dist/app.js"]
