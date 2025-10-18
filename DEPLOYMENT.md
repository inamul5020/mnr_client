# MNR Client Intake System - Deployment Guide

## Quick Start with Docker Compose

### Prerequisites
- Docker and Docker Compose installed
- At least 2GB RAM available
- Ports 3000 and 5433 available

### 1. Clone and Setup
```bash
cd /root/mnr_client
```

### 2. Start the Application
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5433
- Backend API on port 3001
- Frontend on port 3000

### 3. Initialize Database
```bash
# Generate Prisma client
docker-compose exec backend npx prisma generate

# Push schema to database
docker-compose exec backend npx prisma db push
```

### 4. Access the Application
- **Client Form**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **API Health Check**: http://localhost:3001/health

## Coolify Deployment

### 1. Prepare for Coolify
The application is already configured for Coolify deployment with:
- Proper Docker labels
- Health checks
- Environment variable configuration
- Volume persistence for database

### 2. Deploy to Coolify
1. Create a new project in Coolify
2. Connect your Git repository
3. Use the provided `docker-compose.yml`
4. Set environment variables in Coolify dashboard

### 3. Environment Variables
Configure these in Coolify:

**Database:**
- `POSTGRES_DB=mnr_client_intake`
- `POSTGRES_USER=mnr_user`
- `POSTGRES_PASSWORD=your-secure-password`

**Backend:**
- `DATABASE_URL=postgresql://mnr_user:your-secure-password@postgres:5432/mnr_client_intake`
- `NODE_ENV=production`
- `CORS_ORIGIN=https://your-domain.com`

**Frontend:**
- `VITE_API_URL=https://your-api-domain.com`

## Production Considerations

### Security
- Change default database passwords
- Use HTTPS in production
- Configure proper CORS origins
- Set up SSL certificates
- Enable database encryption

### Performance
- Configure database connection pooling
- Set up Redis for caching (optional)
- Use CDN for static assets
- Monitor resource usage

### Monitoring
- Set up health check monitoring
- Configure log aggregation
- Monitor database performance
- Set up alerts for failures

## Database Management

### Backup
```bash
# Create backup
docker-compose exec postgres pg_dump -U mnr_user mnr_client_intake > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U mnr_user mnr_client_intake < backup.sql
```

### Reset Database
```bash
# Stop services
docker-compose down

# Remove database volume
docker volume rm mnr_client_postgres_data

# Start services
docker-compose up -d

# Reinitialize database
docker-compose exec backend npx prisma db push
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check if PostgreSQL is running
   - Verify DATABASE_URL environment variable
   - Check network connectivity between containers

2. **Frontend Can't Connect to API**
   - Verify VITE_API_URL environment variable
   - Check if backend is running on correct port
   - Verify CORS configuration

3. **Export Functions Not Working**
   - Check if backend has write permissions
   - Verify ExcelJS and csv-writer dependencies
   - Check browser console for errors

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Health Checks
```bash
# Check API health
curl http://localhost:3001/health

# Check database connection
docker-compose exec postgres pg_isready -U mnr_user
```

## Scaling

### Horizontal Scaling
- Use load balancer for multiple backend instances
- Configure database read replicas
- Use CDN for frontend assets

### Vertical Scaling
- Increase container memory limits
- Optimize database configuration
- Use SSD storage for database

## Maintenance

### Updates
1. Pull latest changes
2. Rebuild containers: `docker-compose build`
3. Restart services: `docker-compose up -d`
4. Run database migrations if needed

### Monitoring
- Set up application monitoring
- Monitor database performance
- Track error rates and response times
- Set up automated backups

## Support

For technical support or questions:
- Email: support@mnr.com
- Documentation: See README.md
- Issues: Create GitHub issue
