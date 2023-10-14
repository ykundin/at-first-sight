FROM node:18-alpine3.18 as build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm i

# Build the app
ENV NODE_ENV=production
COPY ./ ./
RUN npm run build

# Build release image
FROM node:18-alpine3.18
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist ./dist/

EXPOSE 3000
CMD ["node", "./dist/index.js"]
