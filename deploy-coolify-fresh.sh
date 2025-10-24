#!/bin/bash

# Coolify Fresh Deployment Script - Forces cache busting
echo "🚀 MNR Client Intake - Coolify FRESH Deployment"
echo "================================================"

# Generate cache-busting variables
export BUILD_TIMESTAMP=$(date -u +%Y%m%d%H%M%S)
export GIT_COMMIT=$(git rev-parse --short HEAD)

echo "📅 Build Timestamp: $BUILD_TIMESTAMP"
echo "🔗 Git Commit: $GIT_COMMIT"

# Check if we're in the right directory
if [ ! -f "docker-compose.coolify-v128.yml" ]; then
    echo "❌ Error: docker-compose.coolify-v128.yml not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "✅ Found Coolify configuration file"

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes."
    echo "Please commit and push your changes before deploying."
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
fi

echo "📋 Fresh Deployment Checklist:"
echo "1. ✅ Coolify configuration file exists"
echo "2. ✅ Git repository is ready"
echo "3. ✅ Cache-busting variables set"
echo ""

echo "🔧 Coolify Deployment Steps:"
echo ""
echo "1. In Coolify Dashboard:"
echo "   - Go to your application settings"
echo "   - Change Docker Compose File to: docker-compose.coolify-fresh.yml"
echo "   - OR update docker-compose.coolify-v128.yml to use new Dockerfiles"
echo ""
echo "2. Set these Environment Variables in Coolify:"
echo "   BUILD_TIMESTAMP=$BUILD_TIMESTAMP"
echo "   GIT_COMMIT=$GIT_COMMIT"
echo "   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production"
echo ""
echo "3. Force Rebuild:"
echo "   - Click 'Rebuild' in Coolify"
echo "   - Or delete the application and recreate it"
echo ""
echo "4. Alternative: Use docker-compose.coolify-fresh.yml"
echo "   - This file includes cache-busting by default"
echo "   - No additional environment variables needed"
echo ""

echo "🎯 Cache Busting Features:"
echo "✅ Build timestamps in Docker layers"
echo "✅ Git commit hashes as build args"
echo "✅ Fresh npm installs (no cache)"
echo "✅ Source code builds instead of pre-built dist"
echo "✅ Multi-stage builds for optimization"
echo ""

echo "✅ Ready for fresh Coolify deployment!"
