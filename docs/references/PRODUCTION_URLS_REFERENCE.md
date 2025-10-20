# MNR Client Intake - Multi-Environment URLs & Configuration Reference

## 🎯 **Quick Environment Switch Guide**

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

## 📍 **Multi-Environment Configuration Files**

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

## 🎯 **Key Files for Multi-Environment Setup**

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

### **Production Environment Variables:**
```bash
# Frontend
VITE_API_URL=https://api.mnrlk.com
NODE_ENV=production

# Backend
DATABASE_URL=postgresql://mnr_user:mnr_password@postgres:5432/mnr_client_intake
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://mnrlk.com
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

---

## 🚀 **Current Status - Multi-Environment Ready!**

- ✅ **Development Environment**: Fully configured with localhost URLs
- ✅ **Production Environment**: Fully configured with production URLs
- ✅ **Smart Detection**: Automatic environment detection
- ✅ **Separate Containers**: Isolated dev/prod containers
- ✅ **Environment Files**: Template-based configuration
- ✅ **Automated Scripts**: Easy environment switching
- ✅ **Complete Documentation**: All URLs documented

## 🎯 **Complete URL Summary**

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

## 🔒 **Security Notes for Production**

1. **Change JWT Secret**: Update `JWT_SECRET` in production
2. **Database Security**: Use strong passwords and restrict access
3. **HTTPS**: Ensure SSL certificates are properly configured
4. **CORS**: Verify CORS origins are correctly set
5. **Environment Variables**: Use secure environment variable management

**🚀 Ready for Multi-Environment Deployment!**

---

## 🔍 **Frontend Build Process - Important Notes**

### **Runtime vs Build-Time Configuration**

The frontend uses **runtime URL detection**, which means:

1. **Same Build for Both Environments**: The same `dist` folder works for both development and production
2. **Runtime Detection**: URLs are determined when the application runs in the browser using `window.location.hostname`
3. **Environment Variable Override**: `VITE_API_URL` can override the detection logic
4. **No Hardcoded URLs**: The built JavaScript files don't contain hardcoded API URLs

### **Build Commands**
```bash
# Development build (with localhost override)
VITE_API_URL=http://localhost:3001 npm run build

# Production build (with production override)  
VITE_API_URL=https://api.mnrlk.com npm run build

# Default build (uses runtime detection)
npm run build
```

### **Built Files Location**
- **All Environments**: `/frontend/dist/` (same files, runtime detection)
- **Docker**: Built during Docker image creation with environment variables

### **Why This Approach is Better**
- ✅ **Flexible**: Same build works everywhere
- ✅ **Environment-Aware**: Automatically detects environment
- ✅ **Override Capable**: Can be overridden with environment variables
- ✅ **No Rebuild Required**: Switch environments without rebuilding