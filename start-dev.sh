#!/bin/bash

# MNR Client Intake - Development Environment Setup
# This script sets up and runs the application in development mode

echo "🚀 MNR Client Intake - Development Environment Setup"
echo "====================================================="

# Check if we're in the right directory
if [ ! -f "docker-compose.dev.yml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Create development environment file if it doesn't exist
if [ ! -f ".env.dev" ]; then
    echo "📝 Creating development environment file..."
    cp env.dev.example .env.dev
    echo "✅ Created .env.dev from template"
else
    echo "✅ Development environment file already exists"
fi

echo ""
echo "🔧 Development Configuration:"
echo "=============================="
echo "Frontend: http://localhost:3003"
echo "Backend API: http://localhost:3001"
echo "Database: localhost:5433"
echo "Environment: Development"

echo ""
echo "🚀 Starting Development Environment..."
echo "======================================"

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.dev.yml down

# Start development environment
echo "🔨 Building and starting development services..."
docker-compose -f docker-compose.dev.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
echo "=================="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep mnr-client-dev

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
if docker exec mnr-client-db-dev pg_isready -U mnr_user -d mnr_client_intake > /dev/null 2>&1; then
    echo "✅ Database: Healthy"
else
    echo "❌ Database: Not responding"
fi

echo ""
echo "🎉 Development Environment Ready!"
echo "================================="
echo ""
echo "🌐 Access URLs:"
echo "Frontend: http://localhost:3003"
echo "Backend API: http://localhost:3001"
echo "Health Check: http://localhost:3001/health"
echo ""
echo "📝 Development Notes:"
echo "- Hot reload enabled for development"
echo "- Database persists in postgres_data_dev volume"
echo "- Logs available with: docker-compose -f docker-compose.dev.yml logs -f"
echo "- Stop with: docker-compose -f docker-compose.dev.yml down"
echo ""
echo "✨ Happy Developing!"
