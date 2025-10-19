# Coolify Deployment Guide for MNR Client Intake System

## 🚀 Quick Start

### Step 1: Create Applications in Coolify

**1. Frontend Application:**
- **Name:** `mnr-client-frontend`
- **Type:** Docker Compose
- **Repository:** `https://github.com/inamul5020/mnr_client.git`
- **Branch:** `main`
- **Docker Compose File:** `docker-compose.coolify.yml`
- **Service:** `frontend`

**2. Backend Application:**
- **Name:** `mnr-client-backend`
- **Type:** Docker Compose
- **Repository:** `https://github.com/inamul5020/mnr_client.git`
- **Branch:** `main`
- **Docker Compose File:** `docker-compose.coolify.yml`
- **Service:** `backend`

**3. Database Application:**
- **Name:** `mnr-client-db`
- **Type:** Docker Compose
- **Repository:** `https://github.com/inamul5020/mnr_client.git`
- **Branch:** `main`
- **Docker Compose File:** `docker-compose.coolify.yml`
- **Service:** `postgres`

### Step 2: Configure Domains

**Frontend Domain:**
- **Domain:** `client.mnrlk.com`
- **Points to:** Frontend service
- **Port:** 80 (Coolify handles 80/443 mapping)
- **SSL:** Enable HTTPS (Let's Encrypt)

**Backend Domain:**
- **Domain:** `api.mnrlk.com`
- **Points to:** Backend service
- **Port:** 3001 (Coolify handles 80/443 mapping)
- **SSL:** Enable HTTPS (Let's Encrypt)

### Step 3: Environment Variables

**Backend Environment Variables:**
```bash
DATABASE_URL=postgresql://mnr_user:mnr_password@postgres:5432/mnr_client_intake
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://client.mnrlk.com
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Frontend Environment Variables:**
```bash
VITE_API_URL=https://api.mnrlk.com
```

**Database Environment Variables:**
```bash
POSTGRES_DB=mnr_client_intake
POSTGRES_USER=mnr_user
POSTGRES_PASSWORD=mnr_password
```

## 🔧 Configuration Details

### Port Mapping

**Coolify handles port 80/443 automatically. You need to:**

1. **In Coolify Dashboard:**
   - Go to your application settings
   - Set **Port** to the internal container port
   - Coolify will automatically map this to 80/443 externally

2. **Service Ports:**
   - **Frontend:** Internal port `80` → External `https://client.mnrlk.com`
   - **Backend:** Internal port `3001` → External `https://api.mnrlk.com`
   - **Database:** Internal port `5432` (not exposed externally)

### Health Checks

**Frontend Health Check:**
- **Endpoint:** `/`
- **Expected Response:** HTML page (200 OK)

**Backend Health Check:**
- **Endpoint:** `/health`
- **Expected Response:** `{"status":"OK","timestamp":"...","database":"Connected"}`

## 🐛 Troubleshooting

### Common Issues

**1. "No Available Server" Error:**
- **Check:** Backend service is running and accessible
- **Check:** `https://api.mnrlk.com/health` returns OK
- **Check:** CORS_ORIGIN is set to `https://client.mnrlk.com`

**2. Database Connection Issues:**
- **Check:** PostgreSQL container is healthy
- **Check:** DATABASE_URL is correct
- **Check:** Database credentials match

**3. Frontend Can't Connect to Backend:**
- **Check:** VITE_API_URL is set to `https://api.mnrlk.com`
- **Check:** Backend is accessible from frontend
- **Check:** Both services are in the same network

### Debugging Steps

1. **Check Service Status:**
   - Verify all containers are running
   - Check container logs for errors

2. **Test Backend Directly:**
   - Visit `https://api.mnrlk.com/health`
   - Should return: `{"status":"OK","timestamp":"...","database":"Connected"}`

3. **Test Frontend:**
   - Visit `https://client.mnrlk.com`
   - Check browser console for API errors
   - Look for health check indicator in top-right corner

4. **Check Network Connectivity:**
   - Ensure services can communicate internally
   - Check firewall rules
   - Verify DNS resolution

## 📊 Monitoring

### Health Check Endpoints

- **Backend Health:** `GET https://api.mnrlk.com/health`
- **Frontend Health:** `GET https://client.mnrlk.com/`

### Expected Health Check Response

**Backend:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-19T04:36:26.720Z",
  "database": "Connected"
}
```

**Frontend:**
- HTTP 200 OK
- HTML content served

## 🔒 Security Notes

- Change `JWT_SECRET` to a strong, random value
- Use strong database passwords
- Enable HTTPS for both domains
- Consider using environment-specific secrets
- Regular security updates

## 📝 File Structure

```
mnr_client/
├── docker-compose.yml              # Local development
├── docker-compose.coolify.yml      # Coolify deployment
├── COOLIFY_DEPLOYMENT_GUIDE.md     # This guide
├── backend/                        # Backend service
├── frontend/                       # Frontend service (Static Vite)
└── docs/                          # Documentation
```

## 🎯 Success Criteria

After successful deployment:
- ✅ `https://client.mnrlk.com` loads the frontend
- ✅ `https://api.mnrlk.com/health` returns OK
- ✅ Frontend can communicate with backend
- ✅ Database is connected and accessible
- ✅ All services are healthy and running
