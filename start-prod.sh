#!/bin/bash

# MNR Client Intake - Production Environment Setup
# This script sets up and runs the application in production mode

echo "🚀 MNR Client Intake - Production Environment Setup"
echo "==================================================="

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Create production environment file if it doesn't exist
if [ ! -f ".env.prod" ]; then
    echo "📝 Creating production environment file..."
    cp env.prod.example .env.prod
    echo "⚠️  IMPORTANT: Please edit .env.prod with your production values!"
    echo "   - Change POSTGRES_PASSWORD to a strong password"
    echo "   - Change JWT_SECRET to a secure random string"
    echo "   - Verify CORS_ORIGIN matches your domain"
    echo ""
    read -p "Press Enter to continue after updating .env.prod..."
fi

echo ""
echo "🔧 Production Configuration:"
echo "============================="
echo "Frontend: https://mnrlk.com (or your domain)"
echo "Backend API: https://api.mnrlk.com (or your API domain)"
echo "Database: Internal Docker network"
echo "Environment: Production"

echo ""
echo "🚀 Starting Production Environment..."
echo "====================================="

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Start production environment
echo "🔨 Building and starting production services..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check service status
echo ""
echo "📊 Service Status:"
echo "=================="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep mnr-client-prod

# Health check
echo ""
echo "🏥 Health Check:"
echo "================"

# Check frontend
if curl -s -o /dev/null -w "%{http_code}" http://localhost:80 | grep -q "200"; then
    echo "✅ Frontend: Healthy (http://localhost:80)"
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
if docker exec mnr-client-db-prod pg_isready -U mnr_user -d mnr_client_intake > /dev/null 2>&1; then
    echo "✅ Database: Healthy"
else
    echo "❌ Database: Not responding"
fi

echo ""
echo "🎉 Production Environment Ready!"
echo "================================="
echo ""
echo "🌐 Access URLs:"
echo "Frontend: http://localhost:80 (configure reverse proxy)"
echo "Backend API: http://localhost:3001"
echo "Health Check: http://localhost:3001/health"
echo ""
echo "📝 Production Notes:"
echo "- Configure reverse proxy (nginx) to point to these services"
echo "- Set up SSL certificates for HTTPS"
echo "- Update DNS records to point to your server"
echo "- Monitor logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "- Stop with: docker-compose -f docker-compose.prod.yml down"
echo ""
echo "🔒 Security Reminders:"
echo "- Change JWT_SECRET in production"
echo "- Use strong database passwords"
echo "- Enable HTTPS/SSL certificates"
echo "- Configure proper CORS origins"
echo ""
echo "✨ Production Ready!"
