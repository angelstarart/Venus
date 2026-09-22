# syntax=docker/dockerfile:1

# ============================================================
# Stage 1: Build the client
# ============================================================
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Enable the Yarn version already used by this project.
RUN corepack enable

# Copy dependency manifests first for better Docker layer caching.
COPY package.json yarn.lock ./
COPY packages/client/package.json packages/client/package.json
COPY packages/server/package.json packages/server/package.json

# Install all dependencies required for the build.
RUN yarn install --frozen-lockfile

# Copy application source.
COPY . .

# Build the production client.
RUN NODE_ENV=production yarn build


# ============================================================
# Stage 2: Production runtime
# ============================================================
FROM node:22-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

# Copy dependency manifests.
COPY package.json yarn.lock ./
COPY packages/client/package.json packages/client/package.json
COPY packages/server/package.json packages/server/package.json

# Install production dependencies only.
RUN yarn install --frozen-lockfile --production \
    && yarn cache clean

# Copy the production client bundle.
COPY --from=builder /app/packages/client/destination \
    ./packages/client/destination

# Copy the server source.
COPY packages/server ./packages/server

EXPOSE 80
EXPOSE 443

CMD ["yarn", "server"]