# MNR Client Intake - Complete URL & Configuration Reference

## 🎯 **Multi-Environment Quick Switch Guide**

### **Development Environment (Localhost)**
```bash
# Frontend API URL
VITE_API_URL=http://localhost:3001

# Backend CORS Origin
CORS_ORIGIN=http://localhost:3003

# Database URL
DATABASE_URL=postgresql://mnr_user:mnr_password@postgres:5432/mnr_client_intake

# Service Ports
FRONTEND_PORT=3003
BACKEND_PORT=3001
DATABASE_PORT=5433
```

### **Production Environment**
```bash
# Frontend API URL
VITE_API_URL=https://api.mnrlk.com

# Backend CORS Origin
CORS_ORIGIN=https://mnrlk.com

# Database URL
DATABASE_URL=postgresql://mnr_user:mnr_password@postgres:5432/mnr_client_intake

# Service Ports
FRONTEND_PORT=80
BACKEND_PORT=3001
DATABASE_PORT=5432
```

---

## 📍 **Complete URL Reference - All Files**

### **1. Docker Compose Files**

#### **Development** (`docker-compose.dev.yml`)
```yaml
# Frontend
ports: ["3003:80"]
environment:
  - VITE_API_URL=http://localhost:3001

# Backend
ports: ["3001:3001"]
environment:
  - CORS_ORIGIN=http://localhost:3003
  - DATABASE_URL=postgresql://mnr_user:mnr_password@postgres:5432/mnr_client_intake

# Database
ports: ["5433:5432"]
```

#### **Production** (`docker-compose.prod.yml`)
```yaml
# Frontend
ports: ["80:80"]
environment:
  - VITE_API_URL=${VITE_API_URL:-https://api.mnrlk.com}

# Backend
ports: ["3001:3001"]
environment:
  - CORS_ORIGIN=${CORS_ORIGIN:-https://mnrlk.com}
  - DATABASE_URL=postgresql://mnr_user:${POSTGRES_PASSWORD:-mnr_password}@postgres:5432/mnr_client_intake

# Database
ports: ["5432:5432"]
```

#### **Default** (`docker-compose.yml`)
```yaml
# Same as development configuration
ports: ["3003:80", "3001:3001", "5433:5432"]
environment:
  - CORS_ORIGIN=http://localhost:3003
  - VITE_API_URL=http://localhost:3001
```

### **2. Frontend Configuration Files**

#### **Main Dockerfile** (`/frontend/Dockerfile`)
```dockerfile
# Production URL (used in production builds)
ENV VITE_API_URL=https://api.mnrlk.com
```

#### **API Configuration** (`/frontend/src/lib/apiConfig.ts`)
```typescript
// Runtime API URL detection (NOT build-time)
export const getApiBaseUrl = (): string => {
  // Environment variable takes priority
  if ((import.meta as any).env?.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL;
  }
  
  // Auto-detect based on hostname at runtime
  const hostname = window.location.hostname;
  
  // Development environments
  if (hostname === 'localhost' || hostname === '127.0.0.1' || 
      hostname.startsWith('192.168.') || hostname.startsWith('10.') ||
      hostname.includes('local') || hostname.includes('dev')) {
    return 'http://localhost:3001';
  }
  
  // Production environment
  if (hostname.includes('mnrlk.com') || hostname.includes('mnr')) {
    return 'https://api.mnrlk.com';
  }
  
  // Default to production
  return 'https://api.mnrlk.com';
};
```

**Important**: The frontend uses **runtime detection**, not build-time embedding. The same build works for both environments because URLs are determined when the application runs in the browser.

#### **Vite Config** (`/frontend/vite.config.ts`)
```typescript
// Development proxy configuration
server: {
  port: 3000,  // Development server port
  proxy: {
    '/api': {
      target: 'http://localhost:3001',  // Backend API
      changeOrigin: true,
      secure: false,
    }
  }
}
```

### **3. Backend Configuration Files**

#### **Main Index** (`/backend/src/index.ts`)
```typescript
// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3003',  // Development default
  credentials: true
}));

// Port configuration
const PORT = process.env.PORT || 3000;  // Default port
```

#### **Environment Example** (`/backend/env.example`)
```env
# Development configuration
DATABASE_URL="postgresql://mnr_user:mnr_password@localhost:5433/mnr_client_intake"
CORS_ORIGIN=http://localhost:3000
PORT=3000
```

### **4. Environment Files**

#### **Development Template** (`env.dev.example`)
```bash
# Development URLs
VITE_API_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3003
DATABASE_URL=postgresql://mnr_user:mnr_password@postgres:5432/mnr_client_intake

# Development Ports
FRONTEND_PORT=3003
BACKEND_PORT=3001
DATABASE_PORT=5433
```

#### **Production Template** (`env.prod.example`)
```bash
# Production URLs
VITE_API_URL=https://api.mnrlk.com
CORS_ORIGIN=https://mnrlk.com
DATABASE_URL=postgresql://mnr_user:your-secure-production-password@postgres:5432/mnr_client_intake

# Production Ports
FRONTEND_PORT=80
BACKEND_PORT=3001
DATABASE_PORT=5432
```

### **5. Documentation Files**

#### **README.md**
```markdown
# Development URLs
- Frontend: http://localhost:3003
- Backend API: http://localhost:3001
- Database: localhost:5433

# Production URLs
- Frontend: https://mnrlk.com
- Backend API: https://api.mnrlk.com
- Health Check: https://api.mnrlk.com/health
```

#### **DEPLOYMENT.md**
```markdown
# Development URLs
- Frontend: http://localhost:3003
- Backend API: http://localhost:3001
- Database: localhost:5433

# Production URLs
- Frontend: https://mnrlk.com
- Backend API: https://api.mnrlk.com
- Health Check: https://api.mnrlk.com/health
```

#### **API.md**
```markdown
# Base URLs
## Production
https://api.mnrlk.com/api

## Development
http://localhost:3001/api
```

### **6. Scripts**

#### **Development Script** (`start-dev.sh`)
```bash
# Development URLs
echo "Frontend: http://localhost:3003"
echo "Backend API: http://localhost:3001"
echo "Health Check: http://localhost:3001/health"

# Health checks
curl http://localhost:3003
curl http://localhost:3001/health
```

#### **Production Script** (`start-prod.sh`)
```bash
# Production URLs
echo "Frontend: http://localhost:80 (configure reverse proxy)"
echo "Backend API: http://localhost:3001"
echo "Health Check: http://localhost:3001/health"

# Health checks
curl http://localhost:80
curl http://localhost:3001/health
```

#### **Deploy Production Script** (`deploy-production.sh`)
```bash
# Production URLs
echo "Frontend: http://localhost:3003"  # Note: Should be 80 for production
echo "Backend API: http://localhost:3001"
echo "Health Check: http://localhost:3001/health"
```

---

## 🔄 **Environment Switching Commands**

### **Switch to Development:**
```bash
# Stop current environment
docker-compose down

# Start development
docker-compose -f docker-compose.dev.yml up -d
# OR
./start-dev.sh
```

### **Switch to Production:**
```bash
# Stop current environment
docker-compose down

# Start production
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
# OR
./start-prod.sh
```

### **Manual URL Updates:**
```bash
# Update docker-compose.yml for development
sed -i 's|CORS_ORIGIN=https://mnrlk.com|CORS_ORIGIN=http://localhost:3003|g' docker-compose.yml
sed -i 's|VITE_API_URL=https://api.mnrlk.com|VITE_API_URL=http://localhost:3001|g' docker-compose.yml

# Update docker-compose.yml for production
sed -i 's|CORS_ORIGIN=http://localhost:3003|CORS_ORIGIN=https://mnrlk.com|g' docker-compose.yml
sed -i 's|VITE_API_URL=http://localhost:3001|VITE_API_URL=https://api.mnrlk.com|g' docker-compose.yml

# Update backend CORS for development
sed -i "s|origin: process.env.CORS_ORIGIN || 'https://mnrlk.com'|origin: process.env.CORS_ORIGIN || 'http://localhost:3003'|g" backend/src/index.ts

# Update backend CORS for production
sed -i "s|origin: process.env.CORS_ORIGIN || 'http://localhost:3003'|origin: process.env.CORS_ORIGIN || 'https://mnrlk.com'|g" backend/src/index.ts
```

---

## 📊 **Complete URL Summary**

### **Development Environment**
| Service | URL | Port | Container Name |
|---------|-----|------|----------------|
| **Frontend** | http://localhost:3003 | 3003 | mnr-client-frontend-dev |
| **Backend API** | http://localhost:3001 | 3001 | mnr-client-backend-dev |
| **Database** | localhost:5433 | 5433 | mnr-client-db-dev |
| **Health Check** | http://localhost:3001/health | 3001 | mnr-client-backend-dev |

### **Production Environment**
| Service | URL | Port | Container Name |
|---------|-----|------|----------------|
| **Frontend** | https://mnrlk.com | 80 | mnr-client-frontend-prod |
| **Backend API** | https://api.mnrlk.com | 3001 | mnr-client-backend-prod |
| **Database** | Internal Docker | 5432 | mnr-client-db-prod |
| **Health Check** | https://api.mnrlk.com/health | 3001 | mnr-client-backend-prod |

---

## 🎯 **Key Files to Update for Environment Changes**

### **Critical Files (Must Update):**
1. `docker-compose.dev.yml` - Development configuration
2. `docker-compose.prod.yml` - Production configuration
3. `docker-compose.yml` - Default configuration
4. `frontend/src/lib/apiConfig.ts` - API URL detection logic
5. `backend/src/index.ts` - CORS configuration

### **Environment Files:**
1. `env.dev.example` - Development environment template
2. `env.prod.example` - Production environment template
3. `.env.dev` - Development environment (created from template)
4. `.env.prod` - Production environment (created from template)

### **Scripts:**
1. `start-dev.sh` - Development setup script
2. `start-prod.sh` - Production setup script
3. `deploy-production.sh` - Production deployment script
4. `verify-production.sh` - Production verification script

---

## 🚀 **Current Status - Multi-Environment Ready!**

- ✅ **Development Environment**: Fully configured with localhost URLs
- ✅ **Production Environment**: Fully configured with production URLs
- ✅ **Smart Detection**: Automatic environment detection
- ✅ **Separate Containers**: Isolated dev/prod containers
- ✅ **Environment Files**: Template-based configuration
- ✅ **Automated Scripts**: Easy environment switching
- ✅ **Complete Documentation**: All URLs documented

## 🔒 **Security Notes for Production**

1. **Change JWT Secret**: Update `JWT_SECRET` in production
2. **Database Security**: Use strong passwords and restrict access
3. **HTTPS**: Ensure SSL certificates are properly configured
4. **CORS**: Verify CORS origins are correctly set
5. **Environment Variables**: Use secure environment variable management

**🚀 Ready for Multi-Environment Deployment!**
