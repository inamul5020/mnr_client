# 📋 Template Usage Guide

## Quick Start

### 1. Use the Template
```bash
# Clone the template
git clone https://github.com/yourusername/mymasjid-template.git my-new-project
cd my-new-project

# Remove template git history
rm -rf .git
git init
```

### 2. Customize the Template
```bash
# Run the customization script
./docs/templates/git/customize_template.sh

# Follow the prompts to enter your project details
```

### 3. Setup and Run
```bash
# Run the setup script
./setup.sh

# Start development
cd server && npm run dev &  # Backend
npm run dev                 # Frontend
```

## Template Files

### Core Template Files
- `docs/templates/git/PROJECT_TEMPLATE.md` - Master template with placeholders
- `docs/templates/git/customize_template.sh` - Automated customization script
- `setup.sh` - Generated setup script
- `deploy.sh` - Generated deployment script

### Generated Files
- `README.md` - Customized project documentation
- `server/.env` - Development environment variables
- `.env` - Frontend environment variables
- `docker-compose.yml` - Database setup
- Production environment files

## Customization Options

### Project Details
- Project name
- Project description
- Project tagline
- GitHub username
- Contact information
- Database configuration
- Domain settings
- JWT secret
- License type

### Automated Updates
The script automatically updates:
- Package.json files
- Environment variables
- Docker configuration
- README.md content
- Setup and deployment scripts

## Manual Customization

### Update Package Names
```bash
# Update backend package name
sed -i 's/masjid-saas-backend/your-project-name/g' server/package.json

# Update frontend package name
sed -i 's/vite-react-typescript-starter/your-project-name/g' package.json
```

### Update Database Schema
```bash
# Edit Prisma schema for your entities
nano prisma/schema.prisma

# Apply changes
npx prisma db push
```

### Update API Routes
```bash
# Edit backend routes
nano server/src/routes/members.ts
nano server/src/routes/households.ts
nano server/src/routes/receipts.ts
```

### Update Frontend Components
```bash
# Edit frontend pages
nano src/pages/members/MembersList.tsx
nano src/pages/DashboardPage.tsx
nano src/pages/households/HouseholdsPage.tsx
```

## Template Variables

### Placeholder Format
All placeholders use the format `[VARIABLE_NAME]` and are replaced by the customization script.

### Common Variables
- `[PROJECT_NAME]` - Your project name
- `[PROJECT_DESCRIPTION]` - Project description
- `[YOUR_USERNAME]` - GitHub username
- `[DB_NAME]` - Database name
- `[YOUR_DOMAIN]` - Production domain
- `[JWT_SECRET]` - JWT secret key

## Best Practices

### 1. Naming Conventions
- Use kebab-case for project names
- Use descriptive names for entities
- Keep database names simple
- Use environment-specific domains

### 2. Security
- Generate strong JWT secrets
- Use environment variables for secrets
- Don't commit .env files
- Use HTTPS in production

### 3. Documentation
- Update README.md for your project
- Document API changes
- Keep error logs updated
- Document deployment process

## Troubleshooting

### Common Issues
1. **Script Permission**: `chmod +x customize_template.sh`
2. **Database Connection**: Check DATABASE_URL in .env
3. **Port Conflicts**: Ensure ports 3001 and 5173 are free
4. **Dependencies**: Run `npm install` in both directories

### Debug Commands
```bash
# Check database connection
npx prisma db push

# Check backend logs
cd server && npm run dev

# Check frontend build
npm run build

# Check Docker containers
docker ps
```

## Advanced Customization

### Custom Entities
1. Update Prisma schema
2. Create API routes
3. Update frontend components
4. Add to dashboard
5. Update documentation

### Custom Features
1. Add new pages
2. Implement new API endpoints
3. Add authentication flows
4. Implement business logic
5. Add tests

### Custom Styling
1. Update Tailwind configuration
2. Modify component styles
3. Add custom CSS
4. Update color scheme
5. Add branding elements

## Deployment

### Development
```bash
./setup.sh
```

### Production
```bash
./deploy.sh
```

### Manual Deployment
1. Build frontend: `npm run build`
2. Build backend: `cd server && npm run build`
3. Setup production environment
4. Deploy to server
5. Configure reverse proxy
6. Setup SSL certificates

## Support

### Documentation
- Check `docs/` folder for detailed guides
- Review `docs/technical/error-log.md` for common issues
- Use `docs/templates/` for bolt.new development

### Getting Help
1. Check error logs
2. Review documentation
3. Search GitHub issues
4. Create new issue if needed

---

**Template Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: Production Ready
