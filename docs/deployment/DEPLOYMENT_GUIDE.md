# MNR Client Intake System - Deployment Guide

## 🎯 **Stable Version v1.5.0 - Production Deployment**

This guide covers the complete deployment of the MNR Client Intake System to Coolify.

## ✅ **Prerequisites**

- Coolify account and server access
- Domain names configured:
  - `client.mnrlk.com` (Frontend)
  - `api.mnrlk.com` (Backend API)
- Docker and Docker Compose installed on Coolify server

## 🚀 **Quick Deployment**

### **Step 1: Use Stable Configuration**
```bash
# Use the stable docker-compose file
docker-compose.coolify-v128.yml
```

### **Step 2: Set Environment Variables**
```bash
# Required Environment Variables
POSTGRES_DB=mnr_client_intake
POSTGRES_USER=mnr_user
POSTGRES_PASSWORD=mnr_password
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://client.mnrlk.com
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
VITE_API_URL=https://api.mnrlk.com
```

### **Step 3: Deploy Services**
1. **PostgreSQL** - Database service
2. **Backend** - API service (Node.js + Express)
3. **Frontend** - Web interface (React + Vite)

## 📋 **Detailed Deployment Steps**

### **1. Database Service (PostgreSQL)**

**Configuration:**
- **Image**: `postgres:16-alpine`
- **Port**: `5432` (internal)
- **Database**: `mnr_client_intake`
- **User**: `mnr_user`
- **Password**: `mnr_password`

**Environment Variables:**
```bash
POSTGRES_DB=mnr_client_intake
POSTGRES_USER=mnr_user
POSTGRES_PASSWORD=mnr_password
```

**Health Check:**
```bash
pg_isready -U mnr_user -d mnr_client_intake
```

### **2. Backend Service (API)**

**Configuration:**
- **Dockerfile**: `Dockerfile.simple-working`
- **Port**: `3001` (internal)
- **Build Context**: `./backend`

**Environment Variables:**
```bash
DATABASE_URL=postgresql://mnr_user:mnr_password@postgres:5432/mnr_client_intake
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://client.mnrlk.com
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Health Check:**
```bash
GET /health
```

**API Endpoints:**
- `GET /health` - Health check
- `POST /api/auth/login` - User authentication
- `POST /api/intake` - Submit client intake
- `GET /api/intake` - List client intakes
- `GET /api/export/excel/:id` - Export to Excel
- `GET /api/export/csv/:id` - Export to CSV

### **3. Frontend Service (Web Interface)**

**Configuration:**
- **Dockerfile**: `Dockerfile.simple-stable`
- **Port**: `80` (internal)
- **Build Context**: `./frontend`

**Environment Variables:**
```bash
VITE_API_URL=https://api.mnrlk.com
```

**Health Check:**
```bash
GET /
```

## 🔧 **Coolify Configuration**

### **Service Labels**
```yaml
labels:
  - "coolify.managed=true"
  - "coolify.name=service-name"
  - "coolify.port=port-number"
  - "coolify.healthcheck=/health"
```

### **Port Mapping**
- **Frontend**: `80` → External access
- **Backend**: `3001` → External access
- **Database**: `5432` → Internal only

### **Health Checks**
- **Frontend**: `https://client.mnrlk.com/`
- **Backend**: `https://api.mnrlk.com/health`
- **Database**: Internal health check

## 👥 **Default Users**

| Username | Password | Role | Full Name |
|----------|----------|------|-----------|
| admin | admin123 | ADMIN | System Administrator |
| manager | manager123 | MANAGER | John Manager |
| staff1 | staff123 | STAFF | Sarah Staff |
| staff2 | staff123 | STAFF | Mike Staff |

## 🔍 **Verification Steps**

### **1. Check Service Health**
```bash
# Frontend
curl https://client.mnrlk.com/

# Backend
curl https://api.mnrlk.com/health

# Expected response
{"status":"OK","timestamp":"...","database":"Connected"}
```

### **2. Test Authentication**
```bash
curl -X POST https://api.mnrlk.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### **3. Test Form Submission**
1. Go to `https://client.mnrlk.com`
2. Login with admin credentials
3. Fill out the client intake form
4. Submit and verify data is saved

### **4. Test Admin Dashboard**
1. Go to `https://client.mnrlk.com/admin`
2. Verify client data is displayed
3. Test edit functionality
4. Test export functionality

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **1. 503 Service Unavailable**
- **Cause**: Backend not starting
- **Solution**: Check backend logs, verify environment variables

#### **2. CORS Errors**
- **Cause**: Incorrect CORS_ORIGIN setting
- **Solution**: Set `CORS_ORIGIN=https://client.mnrlk.com`

#### **3. Database Connection Failed**
- **Cause**: Database not ready or wrong connection string
- **Solution**: Check database health, verify DATABASE_URL

#### **4. Frontend Not Loading**
- **Cause**: Frontend build failed or wrong API URL
- **Solution**: Check frontend logs, verify VITE_API_URL

### **Debug Commands**

```bash
# Check service status
docker-compose ps

# Check logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Check database connection
docker-compose exec postgres psql -U mnr_user -d mnr_client_intake -c "SELECT 1;"
```

## 📊 **Monitoring**

### **Health Endpoints**
- **Frontend**: `https://client.mnrlk.com/`
- **Backend**: `https://api.mnrlk.com/health`
- **Database**: Internal health check

### **Logs**
- Check Coolify logs for each service
- Monitor error rates and response times
- Set up alerts for service failures

## 🔒 **Security Considerations**

### **Environment Variables**
- Change default passwords
- Use strong JWT secret
- Rotate secrets regularly

### **Network Security**
- Use HTTPS for all external access
- Configure proper CORS settings
- Monitor for suspicious activity

### **Database Security**
- Use strong database passwords
- Limit database access to backend only
- Regular backups

## 📈 **Performance Optimization**

### **Database**
- Monitor query performance
- Add indexes as needed
- Regular maintenance

### **Backend**
- Monitor memory usage
- Optimize API responses
- Implement caching if needed

### **Frontend**
- Monitor bundle size
- Optimize images and assets
- Implement lazy loading

## 🔄 **Updates and Maintenance**

### **Updating the System**
1. Pull latest changes
2. Update environment variables if needed
3. Redeploy services
4. Verify functionality

### **Backup Strategy**
1. Database backups (automated)
2. Configuration backups
3. Code repository backups

### **Monitoring**
1. Service health checks
2. Error rate monitoring
3. Performance metrics
4. User activity logs

## 📞 **Support**

### **Documentation**
- `STABLE_VERSION.md` - Complete system documentation
- `README.md` - Project overview
- `API.md` - API documentation

### **Troubleshooting**
1. Check service logs
2. Verify environment variables
3. Test individual components
4. Check network connectivity

---

**This deployment guide ensures a successful, stable deployment of the MNR Client Intake System.** 🎉
