FROM oven/bun:1.0.3 AS build
WORKDIR /app

ARG PORT
ARG IMGPROXY_URL

ENV PORT ${PORT:-}
ENV IMGPROXY_URL ${IMGPROXY_URL:-}

# Install dependencies
COPY package.json bun.lockb ./
RUN bun i

# Build the app
ENV NODE_ENV=production
COPY src src/
COPY index.html tsconfig.json tsconfig.node.json vite.config.ts ./
RUN bun run build

# Build release image
FROM node:16-alpine AS release
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules/
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist/

EXPOSE 3000
CMD ["npm", "run", "preview"]
