FROM oven/bun:latest AS build
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun i

# Build the app
ENV NODE_ENV=production
COPY src src/
COPY index.html tsconfig.json tsconfig.node.json vite.config.ts ./
RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "preview"]
