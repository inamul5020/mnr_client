# Coolify Deployment Configuration

## Port Configuration

### Backend Service
- **Internal Port:** 3001
- **External Port:** 3001 (or any available port)
- **Protocol:** HTTP
- **Health Check:** `/health`

### Frontend Service
- **Internal Port:** 80
- **External Port:** 80 (or any available port)
- **Protocol:** HTTP
- **Health Check:** `/`

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

## Domain Configuration

### Frontend Domain
- **Domain:** `client.mnrlk.com`
- **Points to:** Frontend service (port 80)
- **SSL:** Enable HTTPS

### Backend Domain
- **Domain:** `api.mnrlk.com`
- **Points to:** Backend service (port 3001)
- **SSL:** Enable HTTPS

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
