#!/bin/bash

# Coolify Deployment Script for MNR Client Intake System
# This script helps prepare and deploy to Coolify

echo "🚀 MNR Client Intake - Coolify Deployment Script"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "docker-compose.coolify.yml" ]; then
    echo "❌ Error: docker-compose.coolify.yml not found!"
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

echo "📋 Deployment Checklist:"
echo "1. ✅ Coolify configuration file exists"
echo "2. ✅ Git repository is ready"
echo ""
echo "🔧 Next Steps for Coolify:"
echo ""
echo "1. Create Applications in Coolify:"
echo "   - Frontend: mnr-client-frontend"
echo "   - Backend: mnr-client-backend" 
echo "   - Database: mnr-client-db"
echo ""
echo "2. Use this configuration:"
echo "   - Repository: https://github.com/inamul5020/mnr_client.git"
echo "   - Branch: main"
echo "   - Docker Compose File: docker-compose.coolify.yml"
echo ""
echo "3. Set Environment Variables:"
echo "   Backend:"
echo "   - CORS_ORIGIN=https://client.mnrlk.com"
echo "   - JWT_SECRET=your-super-secret-jwt-key-change-this-in-production"
echo ""
echo "   Frontend:"
echo "   - VITE_API_URL=https://api.mnrlk.com"
echo ""
echo "4. Configure Domains:"
echo "   - client.mnrlk.com → Frontend (port 80)"
echo "   - api.mnrlk.com → Backend (port 3001)"
echo ""
echo "5. Enable SSL for both domains"
echo ""
echo "📖 For detailed instructions, see: COOLIFY_DEPLOYMENT_GUIDE.md"
echo ""
echo "🎯 After deployment, test:"
echo "   - https://client.mnrlk.com"
echo "   - https://api.mnrlk.com/health"
echo ""
echo "✅ Ready for Coolify deployment!"
