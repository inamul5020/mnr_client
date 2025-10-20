# MNR Client Intake - Production URLs & Configuration Reference

## 🎯 **Quick Environment Switch Guide**

### **For Localhost Development:**
```bash
# Frontend API URL
VITE_API_URL=http://localhost:3001

# Backend CORS Origin
CORS_ORIGIN=http://localhost:3000

# Database URL
DATABASE_URL=postgresql://mnr_user:mnr_password@localhost:5433/mnr_client_intake
```

### **For Production Deployment:**
```bash
# Frontend API URL
VITE_API_URL=https://api.mnrlk.com

# Backend CORS Origin
CORS_ORIGIN=https://mnrlk.com

# Database URL
DATABASE_URL=postgresql://mnr_user:mnr_password@postgres:5432/mnr_client_intake
```

---

## 📍 **All Production URLs Found in Codebase**

### **1. Frontend Configuration Files**

#### **Main Dockerfile** (`/frontend/Dockerfile`)
```dockerfile
ENV VITE_API_URL=https://api.mnrlk.com  # ✅ UPDATED FOR PRODUCTION
```

#### **API Configuration** (`/frontend/src/lib/apiConfig.ts`)
```typescript
// Production detection logic
if (hostname.includes('mnrlk.com') || hostname.includes('mnr')) {
  return 'https://api.mnrlk.com';
}
// Default to production for any other scenario
return 'https://api.mnrlk.com';
```

### **2. Backend Configuration Files**

#### **Main Index** (`/backend/src/index.ts`)
```typescript
origin: process.env.CORS_ORIGIN || 'https://mnrlk.com'  # ✅ UPDATED FOR PRODUCTION
```

#### **Database Connection** (`/backend/src/index.ts`)
```typescript
url: process.env.DATABASE_URL
```

### **3. Docker Compose Files**

#### **Main Development** (`docker-compose.yml`)
```yaml
environment:
  - DATABASE_URL=postgresql://mnr_user:mnr_password@postgres:5432/mnr_client_intake
  - CORS_ORIGIN=https://mnrlk.com  # ✅ UPDATED FOR PRODUCTION
  - VITE_API_URL=https://api.mnrlk.com  # ✅ UPDATED FOR PRODUCTION
```

---

## 🔄 **Environment Switching Commands**

### **Switch to Localhost Development:**
```bash
# Update main Dockerfile
sed -i 's|ENV VITE_API_URL=https://api.mnrlk.com|ENV VITE_API_URL=http://localhost:3001|g' frontend/Dockerfile

# Update main docker-compose.yml
sed -i 's|CORS_ORIGIN=https://mnrlk.com|CORS_ORIGIN=http://localhost:3000|g' docker-compose.yml
sed -i 's|VITE_API_URL=https://api.mnrlk.com|VITE_API_URL=http://localhost:3001|g' docker-compose.yml

# Update backend CORS
sed -i 's|origin: process.env.CORS_ORIGIN || '\''https://mnrlk.com'\''|origin: process.env.CORS_ORIGIN || '\''http://localhost:3000'\''|g' backend/src/index.ts

# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up -d --force-recreate frontend
```

### **Switch to Production:**
```bash
# Update main Dockerfile
sed -i 's|ENV VITE_API_URL=http://localhost:3001|ENV VITE_API_URL=https://api.mnrlk.com|g' frontend/Dockerfile

# Update main docker-compose.yml
sed -i 's|CORS_ORIGIN=http://localhost:3000|CORS_ORIGIN=https://mnrlk.com|g' docker-compose.yml
sed -i 's|VITE_API_URL=http://localhost:3001|VITE_API_URL=https://api.mnrlk.com|g' docker-compose.yml

# Update backend CORS
sed -i 's|origin: process.env.CORS_ORIGIN || '\''http://localhost:3000'\''|origin: process.env.CORS_ORIGIN || '\''https://mnrlk.com'\''|g' backend/src/index.ts

# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up -d --force-recreate frontend
```

---

## 🎯 **Key Files Updated for Production**

### **Critical Files (Updated):**
1. ✅ `frontend/Dockerfile` - Set to `https://api.mnrlk.com`
2. ✅ `docker-compose.yml` - Set to production URLs
3. ✅ `frontend/src/lib/apiConfig.ts` - Smart detection with production default
4. ✅ `backend/src/index.ts` - CORS origin set to `https://mnrlk.com`

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

## 🚀 **Current Status - READY FOR PRODUCTION!**

- ✅ **Main Dockerfile**: Set to `https://api.mnrlk.com` (Production)
- ✅ **Main docker-compose.yml**: Set to production URLs (Production)
- ✅ **API Detection**: Smart detection with production default
- ✅ **Backend CORS**: Set to `https://mnrlk.com` (Production)
- ✅ **All configurations**: Updated for production deployment

## 🎯 **Production URLs Summary**

### **Frontend URLs**
- **Main Application**: `https://mnrlk.com`
- **API Endpoint**: `https://api.mnrlk.com`

### **Backend URLs**
- **API Base**: `https://api.mnrlk.com`
- **Health Check**: `https://api.mnrlk.com/health`
- **Authentication**: `https://api.mnrlk.com/api/auth/login`

### **Database**
- **Internal Docker Network**: `postgresql://mnr_user:mnr_password@postgres:5432/mnr_client_intake`

## 🔒 **Security Notes for Production**

1. **Change JWT Secret**: Update `JWT_SECRET` in production
2. **Database Security**: Use strong passwords and restrict access
3. **HTTPS**: Ensure SSL certificates are properly configured
4. **CORS**: Verify CORS origins are correctly set
5. **Environment Variables**: Use secure environment variable management

**🚀 READY FOR PRODUCTION DEPLOYMENT!**