# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git

# Copy package files
COPY package.json package-lock.json* ./

# Clear npm cache and install dependencies
RUN npm cache clean --force && \
    npm install --no-audit --no-fund --prefer-offline

# Copy source code
COPY . .

# Set environment variables for build
ENV NODE_ENV=production
ENV VITE_API_URL=https://api.mnrlk.com

# Verify installation and build tools
RUN echo "=== Build Environment ===" && \
    node --version && \
    npm --version && \
    which tsc && \
    which vite && \
    npm list typescript vite @vitejs/plugin-react && \
    echo "=== Starting Build ==="

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
