# Multi-stage Dockerfile for frontend static build and backend API

# Build frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app
COPY package.json package-lock.json* ./
COPY . ./
RUN npm ci
RUN npm run build

# Production image
FROM node:20-alpine AS runtime
WORKDIR /app
# Install only production dependencies for the API runtime
COPY package.json package-lock.json* ./
RUN npm ci --production
# Copy server and built frontend
COPY --from=build-frontend /app/dist ./dist
COPY server ./server
COPY .env.production.example ./env.example

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "server/index.js"]
