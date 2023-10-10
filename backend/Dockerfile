FROM oven/bun:1.0.3 AS build
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun i

# Build the app
ENV NODE_ENV=production
COPY ./ ./
RUN bun build ./src/infra/run-prod-mode.ts --outdir ./dist --target bun

# Build release image
FROM oven/bun:1.0.3 AS release
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist ./dist/

EXPOSE 3000
CMD ["bun", "run", "./dist/run-dev-mode.js"]
