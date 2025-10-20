#!/bin/bash

# MNR Client Intake - Production Deployment Script
# This script prepares and deploys the application for production

echo "🚀 MNR Client Intake - Production Deployment"
echo "============================================="

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Current Configuration Check:"
echo "=============================="

# Check frontend Dockerfile
if grep -q "ENV VITE_API_URL=https://api.mnrlk.com" frontend/Dockerfile; then
    echo "✅ Frontend Dockerfile: Production URL configured"
else
    echo "❌ Frontend Dockerfile: Not configured for production"
    echo "   Updating to production URL..."
    sed -i 's|ENV VITE_API_URL=http://localhost:3001|ENV VITE_API_URL=https://api.mnrlk.com|g' frontend/Dockerfile
    echo "✅ Frontend Dockerfile: Updated to production URL"
fi

# Check docker-compose.yml
if grep -q "CORS_ORIGIN=https://mnrlk.com" docker-compose.yml; then
    echo "✅ Docker Compose: Production CORS configured"
else
    echo "❌ Docker Compose: Not configured for production"
    echo "   Updating to production URLs..."
    sed -i 's|CORS_ORIGIN=http://localhost:3000|CORS_ORIGIN=https://mnrlk.com|g' docker-compose.yml
    sed -i 's|VITE_API_URL=http://localhost:3001|VITE_API_URL=https://api.mnrlk.com|g' docker-compose.yml
    echo "✅ Docker Compose: Updated to production URLs"
fi

# Check backend CORS
if grep -q "origin: process.env.CORS_ORIGIN || 'https://mnrlk.com'" backend/src/index.ts; then
    echo "✅ Backend CORS: Production origin configured"
else
    echo "❌ Backend CORS: Not configured for production"
    echo "   Updating to production origin..."
    sed -i "s|origin: process.env.CORS_ORIGIN || 'http://localhost:3000'|origin: process.env.CORS_ORIGIN || 'https://mnrlk.com'|g" backend/src/index.ts
    echo "✅ Backend CORS: Updated to production origin"
fi

echo ""
echo "🔧 Production Configuration Summary:"
echo "===================================="
echo "Frontend API URL: https://api.mnrlk.com"
echo "Backend CORS Origin: https://mnrlk.com"
echo "Database: Internal Docker network"
echo "Environment: Production"

echo ""
echo "🚀 Starting Production Deployment..."
echo "===================================="

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start services
echo "🔨 Building and starting production services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
echo "=================="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep mnr-client

# Health check
echo ""
echo "🏥 Health Check:"
echo "================"

# Check frontend
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3003 | grep -q "200"; then
    echo "✅ Frontend: Healthy (http://localhost:3003)"
else
    echo "❌ Frontend: Not responding"
fi

# Check backend
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health | grep -q "200"; then
    echo "✅ Backend: Healthy (http://localhost:3001/health)"
else
    echo "❌ Backend: Not responding"
fi

# Check database
if docker exec mnr-client-db pg_isready -U mnr_user -d mnr_client_intake > /dev/null 2>&1; then
    echo "✅ Database: Healthy"
else
    echo "❌ Database: Not responding"
fi

echo ""
echo "🎉 Production Deployment Complete!"
echo "=================================="
echo ""
echo "🌐 Access URLs:"
echo "Frontend: http://localhost:3003"
echo "Backend API: http://localhost:3001"
echo "Health Check: http://localhost:3001/health"
echo ""
echo "📝 Next Steps:"
echo "1. Configure reverse proxy (nginx) to point to these services"
echo "2. Set up SSL certificates for HTTPS"
echo "3. Update DNS records to point to your server"
echo "4. Change JWT_SECRET in production environment"
echo "5. Set up monitoring and logging"
echo ""
echo "🔒 Security Reminders:"
echo "- Change default JWT secret"
echo "- Use strong database passwords"
echo "- Enable HTTPS in production"
echo "- Configure proper CORS origins"
echo ""
echo "📚 Documentation:"
echo "- See PRODUCTION_URLS_REFERENCE.md for configuration details"
echo "- See README.md for general information"
echo ""
echo "✨ Happy Deploying!"
