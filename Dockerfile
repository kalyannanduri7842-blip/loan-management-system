# Multi-stage Dockerfile for Kalyan Loan Management Platform
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies and build tools
COPY package*.json ./
RUN npm install --omit=dev || true

# Copy full application codebase
COPY . .

# Run build verification
RUN npm run build

# Expose backend API (8080) and frontend UI (5173)
EXPOSE 8080 5173

ENV NODE_ENV=production
ENV PORT=8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:8080/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1));"

CMD ["node", "backend/server.js"]
