# Multi-Environment Docker Setup Guide

## 🎯 Overview

This project now supports separate Docker Compose configurations for development and production environments, allowing you to use the same build files for both environments while maintaining different configurations.

## 📁 File Structure

```
mnr_client/
├── docker-compose.yml          # Default (Development)
├── docker-compose.dev.yml      # Development Environment
├── docker-compose.prod.yml     # Production Environment
├── env.dev.example            # Development Environment Variables Template
├── env.prod.example           # Production Environment Variables Template
├── start-dev.sh              # Development Setup Script
├── start-prod.sh             # Production Setup Script
└── ...
```

## 🚀 Quick Start

### Development Environment
```bash
# Option 1: Use automated script
./start-dev.sh

# Option 2: Manual setup
docker-compose -f docker-compose.dev.yml up -d

# Option 3: Use default (same as dev)
docker-compose up -d
```

### Production Environment
```bash
# Option 1: Use automated script
./start-prod.sh

# Option 2: Manual setup
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## 🔧 Environment Configurations

### Development Environment
- **Frontend**: http://localhost:3003
- **Backend**: http://localhost:3001
- **Database**: localhost:5433
- **Environment**: Development
- **CORS**: http://localhost:3003
- **API URL**: http://localhost:3001

### Production Environment
- **Frontend**: https://mnrlk.com (port 80)
- **Backend**: https://api.mnrlk.com (port 3001)
- **Database**: Internal Docker network (port 5432)
- **Environment**: Production
- **CORS**: https://mnrlk.com
- **API URL**: https://api.mnrlk.com

## 📋 Environment Variables

### Development (.env.dev)
```bash
# Database
POSTGRES_DB=mnr_client_intake
POSTGRES_USER=mnr_user
POSTGRES_PASSWORD=mnr_password
DATABASE_URL=postgresql://mnr_user:mnr_password@postgres:5432/mnr_client_intake

# Backend
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3003
JWT_SECRET=dev-jwt-secret-key

# Frontend
VITE_API_URL=http://localhost:3001
```

### Production (.env.prod)
```bash
# Database
POSTGRES_DB=mnr_client_intake
POSTGRES_USER=mnr_user
POSTGRES_PASSWORD=your-secure-production-password
DATABASE_URL=postgresql://mnr_user:your-secure-production-password@postgres:5432/mnr_client_intake

# Backend
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://mnrlk.com
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend
VITE_API_URL=https://api.mnrlk.com
```

## 🛠️ Docker Compose Files

### docker-compose.dev.yml
- Uses development ports (3003, 3001, 5433)
- Development environment variables
- Localhost CORS configuration
- Development container names

### docker-compose.prod.yml
- Uses production ports (80, 3001, 5432)
- Production environment variables
- Production CORS configuration
- Production container names
- Coolify labels for deployment

### docker-compose.yml (Default)
- Same as development configuration
- Used when running `docker-compose up -d`
- Backward compatibility

## 🚀 Deployment Commands

### Development
```bash
# Start development environment
./start-dev.sh

# Or manually
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

### Production
```bash
# Start production environment
./start-prod.sh

# Or manually
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop production environment
docker-compose -f docker-compose.prod.yml down
```

## 🔄 Switching Between Environments

### From Development to Production
```bash
# Stop development
docker-compose -f docker-compose.dev.yml down

# Start production
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### From Production to Development
```bash
# Stop production
docker-compose -f docker-compose.prod.yml down

# Start development
docker-compose -f docker-compose.dev.yml up -d
```

## 📊 Container Management

### View Running Containers
```bash
# All containers
docker ps

# Development containers only
docker ps --filter "label=environment=development"

# Production containers only
docker ps --filter "label=environment=production"
```

### Container Names
- **Development**: mnr-client-*-dev
- **Production**: mnr-client-*-prod

## 🔒 Security Considerations

### Development
- Uses default passwords (safe for local development)
- CORS allows localhost
- Development JWT secret

### Production
- **MUST** change default passwords
- **MUST** use strong JWT secret
- **MUST** configure proper CORS origins
- **MUST** enable HTTPS/SSL

## 📝 Environment Setup

### First Time Setup
```bash
# Copy environment templates
cp env.dev.example .env.dev
cp env.prod.example .env.prod

# Edit production environment
nano .env.prod
# - Change POSTGRES_PASSWORD
# - Change JWT_SECRET
# - Verify CORS_ORIGIN
```

### Environment File Priority
1. `.env.prod` (for production)
2. `.env.dev` (for development)
3. Environment variables in docker-compose files
4. Default values

## 🎯 Benefits

### ✅ Advantages
- **Same Build Files**: No need to rebuild for different environments
- **Environment Isolation**: Separate containers and volumes
- **Easy Switching**: Simple commands to switch environments
- **Configuration Management**: Centralized environment variables
- **Production Ready**: Coolify-compatible production setup

### 🔧 Use Cases
- **Local Development**: Use dev environment for coding
- **Testing**: Use dev environment for testing
- **Production Deployment**: Use prod environment for live deployment
- **Staging**: Can create additional environments as needed

## 🚨 Important Notes

1. **Port Conflicts**: Development uses ports 3003, 3001, 5433
2. **Production Ports**: Production uses ports 80, 3001, 5432
3. **Volume Separation**: Different volumes for dev/prod data
4. **Environment Variables**: Always use .env files for sensitive data
5. **Security**: Never commit .env files to version control

## 📚 Additional Resources

- **README.md**: Main project documentation
- **DEPLOYMENT.md**: Detailed deployment guide
- **API.md**: API documentation
- **PRODUCTION_URLS_REFERENCE.md**: URL configuration reference
