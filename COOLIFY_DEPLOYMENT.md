# Coolify Deployment Configuration

## Port Configuration for Coolify

### Backend Service (API)
- **Internal Port:** 3001 (exposed via `expose`)
- **Coolify Port:** 3001 (configured via labels)
- **Protocol:** HTTP
- **Health Check:** `/health`
- **Domain:** `api.mnrlk.com`

### Frontend Service (Web App)
- **Internal Port:** 80 (exposed via `expose`)
- **Coolify Port:** 80 (configured via labels)
- **Protocol:** HTTP
- **Health Check:** `/`
- **Domain:** `client.mnrlk.com`

### Database Service
- **Internal Port:** 5432
- **Coolify Port:** 5432 (internal only)
- **Protocol:** PostgreSQL
- **Access:** Internal only (not exposed externally)

## Environment Variables

### Backend Environment Variables
```bash
DATABASE_URL=postgresql://mnr_user:mnr_password@postgres:5432/mnr_client_intake
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=https://client.mnrlk.com
```

### Frontend Environment Variables
```bash
VITE_API_URL=https://api.mnrlk.com
```

### Database Environment Variables
```bash
POSTGRES_DB=mnr_client_intake
POSTGRES_USER=mnr_user
POSTGRES_PASSWORD=mnr_password
```

## Coolify Setup Instructions

### Step 1: Create Applications in Coolify

**1. Frontend Application:**
- **Name:** `mnr-client-frontend`
- **Type:** Docker Compose
- **Repository:** `https://github.com/inamul5020/mnr_client.git`
- **Branch:** `main`
- **Docker Compose File:** `docker-compose.yml`
- **Service:** `frontend`

**2. Backend Application:**
- **Name:** `mnr-client-backend`
- **Type:** Docker Compose
- **Repository:** `https://github.com/inamul5020/mnr_client.git`
- **Branch:** `main`
- **Docker Compose File:** `docker-compose.yml`
- **Service:** `backend`

**3. Database Application:**
- **Name:** `mnr-client-db`
- **Type:** Docker Compose
- **Repository:** `https://github.com/inamul5020/mnr_client.git`
- **Branch:** `main`
- **Docker Compose File:** `docker-compose.yml`
- **Service:** `postgres`

### Step 2: Configure Domains

**Frontend Domain:**
- **Domain:** `client.mnrlk.com`
- **Points to:** Frontend service
- **Port:** 80 (Coolify will handle 80/443 mapping)
- **SSL:** Enable HTTPS (Let's Encrypt)

**Backend Domain:**
- **Domain:** `api.mnrlk.com`
- **Points to:** Backend service
- **Port:** 3001 (Coolify will handle 80/443 mapping)
- **SSL:** Enable HTTPS (Let's Encrypt)

### Step 3: Port Mapping in Coolify

**Important:** Coolify handles port 80/443 automatically. You need to:

1. **In Coolify Dashboard:**
   - Go to your application settings
   - Set **Port** to the internal container port (3001 for backend, 80 for frontend)
   - Coolify will automatically map this to 80/443 externally

2. **For Backend (api.mnrlk.com):**
   - Internal Port: `3001`
   - External Access: Coolify handles 80/443
   - Health Check: `/health`

3. **For Frontend (client.mnrlk.com):**
   - Internal Port: `80`
   - External Access: Coolify handles 80/443
   - Health Check: `/`

## Common Port Issues

### Issue 1: Backend Not Accessible
- **Check:** Backend service is running on port 3001
- **Check:** Port 3001 is exposed in Coolify
- **Check:** Backend is accessible at `https://api.mnrlk.com/health`

### Issue 2: CORS Errors
- **Check:** `CORS_ORIGIN=https://client.mnrlk.com` is set
- **Check:** Backend allows the frontend domain

### Issue 3: Frontend Can't Connect
- **Check:** `VITE_API_URL=https://api.mnrlk.com` is set
- **Check:** Backend is accessible from frontend
- **Check:** Both services are in the same network

## Troubleshooting Steps

1. **Check Service Status**
   - Verify both frontend and backend services are running
   - Check container logs for errors

2. **Test Backend Directly**
   - Visit `https://api.mnrlk.com/health`
   - Should return: `{"status":"OK","timestamp":"...","database":"Connected"}`

3. **Test Frontend**
   - Visit `https://client.mnrlk.com`
   - Check browser console for API errors
   - Look for health check indicator in top-right corner

4. **Check Network Connectivity**
   - Ensure services can communicate internally
   - Check firewall rules
   - Verify DNS resolution

## Health Check Endpoints

- **Backend Health:** `GET /health`
- **Frontend Health:** `GET /` (should load the app)

## Security Notes

- Change `JWT_SECRET` to a strong, random value
- Use strong database passwords
- Enable HTTPS for both domains
- Consider using environment-specific secrets
