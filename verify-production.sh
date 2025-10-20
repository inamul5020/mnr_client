#!/bin/bash

# MNR Client Intake - Production Configuration Verification Script
# This script verifies that all configurations are set for production

echo "🔍 MNR Client Intake - Production Configuration Verification"
echo "============================================================"

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Checking Production Configurations..."
echo "======================================="

# Initialize counters
TOTAL_CHECKS=0
PASSED_CHECKS=0

# Function to check configuration
check_config() {
    local file="$1"
    local pattern="$2"
    local description="$3"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if grep -q "$pattern" "$file" 2>/dev/null; then
        echo "✅ $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo "❌ $description"
        echo "   File: $file"
        echo "   Pattern: $pattern"
    fi
}

# Check frontend Dockerfile
check_config "frontend/Dockerfile" "ENV VITE_API_URL=https://api.mnrlk.com" "Frontend Dockerfile: Production API URL"

# Check docker-compose.yml
check_config "docker-compose.yml" "CORS_ORIGIN=https://mnrlk.com" "Docker Compose: Production CORS Origin"
check_config "docker-compose.yml" "VITE_API_URL=https://api.mnrlk.com" "Docker Compose: Production Frontend API URL"

# Check backend CORS
check_config "backend/src/index.ts" "origin: process.env.CORS_ORIGIN || 'https://mnrlk.com'" "Backend: Production CORS Origin"

# Check API configuration
check_config "frontend/src/lib/apiConfig.ts" "return 'https://api.mnrlk.com'" "Frontend API Config: Production URL Detection"

echo ""
echo "📊 Verification Results:"
echo "======================="
echo "Total Checks: $TOTAL_CHECKS"
echo "Passed: $PASSED_CHECKS"
echo "Failed: $((TOTAL_CHECKS - PASSED_CHECKS))"

if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
    echo ""
    echo "🎉 All configurations are set for production!"
    echo "✅ Ready for production deployment!"
    echo ""
    echo "🚀 To deploy, run: ./deploy-production.sh"
else
    echo ""
    echo "⚠️  Some configurations need to be updated for production."
    echo "📝 See PRODUCTION_URLS_REFERENCE.md for details."
    echo ""
    echo "🔧 To fix automatically, run: ./deploy-production.sh"
fi

echo ""
echo "🌐 Production URLs Summary:"
echo "============================"
echo "Frontend: https://mnrlk.com"
echo "Backend API: https://api.mnrlk.com"
echo "Health Check: https://api.mnrlk.com/health"
echo "Authentication: https://api.mnrlk.com/api/auth/login"

echo ""
echo "🔒 Security Checklist:"
echo "======================"
echo "□ Change JWT_SECRET in production"
echo "□ Use strong database passwords"
echo "□ Enable HTTPS/SSL certificates"
echo "□ Configure proper CORS origins"
echo "□ Set up monitoring and logging"
echo "□ Regular security updates"

echo ""
echo "📚 Documentation:"
echo "================="
echo "- PRODUCTION_URLS_REFERENCE.md: Configuration details"
echo "- README.md: General information"
echo "- DEPLOYMENT.md: Deployment guide"
