# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with better error handling
RUN npm ci --no-audit --no-fund --prefer-offline || \
    (rm -rf node_modules package-lock.json && npm install --no-audit --no-fund)

# Copy source code
COPY . .

# Verify build tools are available
RUN which npm && npm --version && node --version

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
