#!/bin/bash

# Build script for frontend - creates pre-built static files
# This can be used if Coolify build continues to fail

echo "🚀 Building frontend for static deployment..."

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: frontend/package.json not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found!"
    exit 1
fi

echo "✅ Frontend built successfully!"
echo "📁 Built files are in frontend/dist/"
echo ""
echo "To use static deployment:"
echo "1. Change docker-compose.coolify.yml to use Dockerfile.static"
echo "2. Deploy to Coolify"
echo ""
echo "Files ready for static deployment!"
