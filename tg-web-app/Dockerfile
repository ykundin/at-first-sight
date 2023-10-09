FROM oven/bun:1.0.3 AS build
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun i

# Build the app
ENV NODE_ENV=production
COPY src src/
COPY tsconfig.json tsconfig.json
RUN bun run build

# Build release image
FROM oven/bun:1.0.3 AS release
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist ./dist/

EXPOSE 3000
CMD ["bun", "run", "preview"]
