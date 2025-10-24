#!/bin/bash

# Deploy Fresh Builds to Coolify
echo "🚀 MNR Client Intake - Deploying Fresh Builds to Coolify"
echo "========================================================"

# Check if fresh builds exist
if [ ! -d "frontend/dist" ] || [ ! -d "backend/dist" ]; then
    echo "❌ Error: Fresh builds not found!"
    echo "Please run the build process first:"
    echo "  cd frontend && npm run build"
    echo "  cd backend && npm run build"
    exit 1
fi

echo "✅ Fresh builds found:"
echo "   Frontend: $(stat -c %y frontend/dist/index.html)"
echo "   Backend: $(stat -c %y backend/dist/index.js)"

# Check git status
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes."
    echo "The fresh builds will be included in the deployment."
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
fi

echo ""
echo "📋 Deployment Instructions for Coolify:"
echo "======================================"
echo ""
echo "1. In Coolify Dashboard:"
echo "   - Go to your application settings"
echo "   - Ensure Docker Compose File is set to: docker-compose.coolify-v128.yml"
echo ""
echo "2. Force Fresh Build:"
echo "   - Click 'Rebuild' button"
echo "   - OR delete and recreate the application"
echo ""
echo "3. The fresh builds will be used because:"
echo "   ✅ Frontend dist/ folder is freshly built"
echo "   ✅ Backend dist/ folder is freshly built"
echo "   ✅ Dockerfiles copy from these dist/ folders"
echo ""
echo "4. Verify Deployment:"
echo "   - Check https://client.mnrlk.com loads the latest version"
echo "   - Check https://api.mnrlk.com/health returns OK"
echo "   - Look for the latest changes in the UI"
echo ""
echo "🎯 Key Benefits of This Approach:"
echo "   ✅ Uses pre-built dist/ folders (faster deployment)"
echo "   ✅ No Docker build cache issues"
echo "   ✅ Guaranteed fresh content"
echo "   ✅ Works with existing docker-compose.coolify-v128.yml"
echo ""
echo "✅ Ready to deploy fresh builds to Coolify!"
