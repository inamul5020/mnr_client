# Deployment Guide

## Overview

This guide covers deploying the MNR Client Intake System using Docker Compose, with specific instructions for Coolify deployment.

## Prerequisites

- Docker and Docker Compose installed
- PostgreSQL database (if not using containerized version)
- Domain name (for production)
- SSL certificate (for production)

## Quick Deployment

### 1. Clone Repository
```bash
git clone https://github.com/inamul5020/mnr_client.git
cd mnr_client
```

### 2. Environment Configuration

Create environment files:

**Backend (.env)**
```env
DATABASE_URL="postgresql://username:password@postgres:5432/mnr_client"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3001
NODE_ENV=production
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3001
```

### 3. Deploy with Docker Compose
```bash
docker-compose up -d
```

### 4. Initialize Database
```bash
docker-compose exec backend npx prisma db push
docker-compose exec backend npm run db:seed
```

### 5. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Coolify Deployment

### 1. Repository Setup
1. Connect your GitHub repository to Coolify
2. Select the `mnr_client` repository
3. Choose "Docker Compose" as deployment type

### 2. Environment Variables
Set the following environment variables in Coolify:

```env
# Database
DATABASE_URL=postgresql://username:password@postgres:5432/mnr_client

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here

# Port
PORT=3001

# Node Environment
NODE_ENV=production

# Frontend API URL (update with your domain)
VITE_API_URL=https://your-domain.com/api
```

### 3. Docker Compose Configuration
The `docker-compose.yml` file is already configured for Coolify deployment:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mnr_client
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/mnr_client
      JWT_SECRET: ${JWT_SECRET}
      PORT: 3001
      NODE_ENV: production
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend/prisma:/app/prisma

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      VITE_API_URL: ${VITE_API_URL:-http://localhost:3001}
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 4. Domain Configuration
1. Set up your domain in Coolify
2. Configure SSL certificate
3. Update `VITE_API_URL` to use your domain
4. Set up reverse proxy if needed

### 5. Database Initialization
After deployment, initialize the database:

```bash
# Connect to the backend container
docker-compose exec backend sh

# Push database schema
npx prisma db push

# Seed initial data
npm run db:seed
```

## Production Configuration

### 1. Security Hardening

**JWT Secret**
```bash
# Generate a strong JWT secret
openssl rand -base64 32
```

**Database Security**
- Use strong passwords
- Enable SSL connections
- Restrict database access
- Regular backups

**Environment Variables**
- Never commit `.env` files
- Use environment-specific configurations
- Rotate secrets regularly

### 2. Performance Optimization

**Database Indexing**
```sql
-- Add indexes for better performance
CREATE INDEX idx_client_intake_type ON client_intakes(type);
CREATE INDEX idx_client_intake_created_by ON client_intakes(created_by);
CREATE INDEX idx_client_intake_submitted_at ON client_intakes(submitted_at);
CREATE INDEX idx_audit_log_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_log_timestamp ON audit_logs(timestamp);
```

**Docker Optimization**
- Use multi-stage builds
- Optimize image sizes
- Use health checks
- Configure resource limits

### 3. Monitoring and Logging

**Application Logs**
```yaml
# Add to docker-compose.yml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

**Health Checks**
```yaml
# Add health checks
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 4. Backup Strategy

**Database Backup**
```bash
# Create backup script
#!/bin/bash
docker-compose exec postgres pg_dump -U postgres mnr_client > backup_$(date +%Y%m%d_%H%M%S).sql
```

**Automated Backups**
```bash
# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

## Troubleshooting

### Common Issues

**1. Database Connection Failed**
```bash
# Check database status
docker-compose logs postgres

# Verify connection
docker-compose exec backend npx prisma db push
```

**2. Frontend Not Loading**
```bash
# Check frontend logs
docker-compose logs frontend

# Verify API connection
curl http://localhost:3001/api/intake
```

**3. Authentication Issues**
```bash
# Check JWT secret
echo $JWT_SECRET

# Verify token generation
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**4. Permission Issues**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
chmod -R 755 .
```

### Debug Mode

**Enable Debug Logging**
```env
NODE_ENV=development
DEBUG=*
```

**Database Debugging**
```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d mnr_client

# Check tables
\dt

# Check data
SELECT * FROM client_intakes LIMIT 5;
```

## Maintenance

### Regular Tasks

**1. Database Maintenance**
```bash
# Update database schema
docker-compose exec backend npx prisma db push

# Check database size
docker-compose exec postgres psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('mnr_client'));"
```

**2. Log Rotation**
```bash
# Clean old logs
docker-compose logs --tail=1000 > recent_logs.txt
docker-compose restart
```

**3. Security Updates**
```bash
# Update dependencies
docker-compose exec backend npm audit
docker-compose exec frontend npm audit

# Rebuild containers
docker-compose build --no-cache
docker-compose up -d
```

### Monitoring

**1. Application Health**
- Monitor response times
- Check error rates
- Verify database connections
- Monitor disk space

**2. Security Monitoring**
- Review audit logs
- Monitor failed login attempts
- Check for suspicious activity
- Regular security scans

## Scaling

### Horizontal Scaling

**Load Balancer Configuration**
```yaml
# Add to docker-compose.yml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - backend
```

**Multiple Backend Instances**
```yaml
# Scale backend service
docker-compose up -d --scale backend=3
```

### Vertical Scaling

**Resource Limits**
```yaml
# Add to docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

## Support

For deployment issues or questions:

1. Check the logs: `docker-compose logs`
2. Verify environment variables
3. Test database connectivity
4. Review the troubleshooting section
5. Contact the development team

---

**Deployment completed successfully!** 🚀
