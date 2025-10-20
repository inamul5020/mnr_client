#!/bin/bash

# PROJECT_TEMPLATE.md Customization Script
# Usage: ./customize_template.sh

echo "🏢 Project Template Customizer"
echo "=============================="
echo ""

# Get project details from user
read -p "Enter project name (e.g., MyMasjid): " PROJECT_NAME
read -p "Enter project description (e.g., Mosque Management System): " PROJECT_DESCRIPTION
read -p "Enter project tagline (e.g., Modern mosque management solution): " PROJECT_TAGLINE
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter your email: " YOUR_EMAIL
read -p "Enter your name: " YOUR_NAME
read -p "Enter database name (e.g., masjid_db): " DB_NAME
read -p "Enter database password: " DB_PASSWORD
read -p "Enter your domain (e.g., mymasjid.com): " YOUR_DOMAIN
read -p "Enter API domain (e.g., api.mymasjid.com): " API_DOMAIN
read -p "Enter JWT secret (or press Enter for auto-generated): " JWT_SECRET
read -p "Enter license type (e.g., MIT): " LICENSE_TYPE
read -p "Enter project status (e.g., Production Ready): " PROJECT_STATUS

# Generate JWT secret if not provided
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "Generated JWT secret: $JWT_SECRET"
fi

# Get current date
CURRENT_DATE=$(date +"%B %Y")

# Create customized README.md
echo "Creating customized README.md..."
cp PROJECT_TEMPLATE.md README.md

# Replace placeholders
sed -i "s/\[PROJECT_NAME\]/$PROJECT_NAME/g" README.md
sed -i "s/\[PROJECT_DESCRIPTION\]/$PROJECT_DESCRIPTION/g" README.md
sed -i "s/\[PROJECT_TAGLINE\]/$PROJECT_TAGLINE/g" README.md
sed -i "s/\[YOUR_USERNAME\]/$GITHUB_USERNAME/g" README.md
sed -i "s/\[YOUR_EMAIL\]/$YOUR_EMAIL/g" README.md
sed -i "s/\[YOUR_NAME\]/$YOUR_NAME/g" README.md
sed -i "s/\[DB_NAME\]/$DB_NAME/g" README.md
sed -i "s/\[DB_PASSWORD\]/$DB_PASSWORD/g" README.md
sed -i "s/\[YOUR_DOMAIN\]/$YOUR_DOMAIN/g" README.md
sed -i "s/\[API_DOMAIN\]/$API_DOMAIN/g" README.md
sed -i "s/\[YOUR_SUPER_SECRET_JWT_KEY\]/$JWT_SECRET/g" README.md
sed -i "s/\[LICENSE_TYPE\]/$LICENSE_TYPE/g" README.md
sed -i "s/\[PROJECT_STATUS\]/$PROJECT_STATUS/g" README.md
sed -i "s/\[CURRENT_DATE\]/$CURRENT_DATE/g" README.md

# Update package.json files
echo "Updating package.json files..."
sed -i "s/masjid-saas-backend/$PROJECT_NAME/g" server/package.json
sed -i "s/vite-react-typescript-starter/$PROJECT_NAME/g" package.json

# Create .env file
echo "Creating server/.env file..."
cat > server/.env << EOF
# Database Configuration
DATABASE_URL="postgresql://postgres:$DB_PASSWORD@localhost:5432/$DB_NAME"

# JWT Configuration
JWT_SECRET="$JWT_SECRET"

# Server Configuration
NODE_ENV="development"
PORT=3001

# CORS Configuration
CORS_ORIGIN="http://localhost:5173,http://localhost:5174"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

# Create frontend .env file
echo "Creating frontend .env file..."
cat > .env << EOF
# API Configuration
VITE_API_BASE_URL="http://localhost:3001/api"

# Development Configuration
VITE_APP_NAME="$PROJECT_NAME"
VITE_APP_DESCRIPTION="$PROJECT_DESCRIPTION"
EOF

# Create production .env files
echo "Creating production environment files..."
cat > server/.env.production << EOF
# Database Configuration
DATABASE_URL="postgresql://postgres:$DB_PASSWORD@localhost:5432/$DB_NAME"

# JWT Configuration
JWT_SECRET="$JWT_SECRET"

# Server Configuration
NODE_ENV="production"
PORT=3001

# CORS Configuration
CORS_ORIGIN="https://$YOUR_DOMAIN"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

cat > .env.production << EOF
# API Configuration
VITE_API_BASE_URL="https://$API_DOMAIN/api"

# Production Configuration
VITE_APP_NAME="$PROJECT_NAME"
VITE_APP_DESCRIPTION="$PROJECT_DESCRIPTION"
EOF

# Create Docker Compose file
echo "Creating docker-compose.yml..."
cat > docker-compose.yml << EOF
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: ${PROJECT_NAME,,}-db
    environment:
      POSTGRES_DB: $DB_NAME
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: $DB_PASSWORD
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: ${PROJECT_NAME,,}-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@$YOUR_DOMAIN
      PGADMIN_DEFAULT_PASSWORD: $DB_PASSWORD
    ports:
      - "5050:80"
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  postgres_data:
EOF

# Create setup script
echo "Creating setup.sh script..."
cat > setup.sh << EOF
#!/bin/bash

echo "🚀 Setting up $PROJECT_NAME..."
echo "================================"

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd server && npm install && cd ..

# Start database
echo "🗄️ Starting database..."
docker-compose up -d postgres

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Setup database
echo "🔧 Setting up database..."
npx prisma db push
npm run db:seed

echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  Backend:  cd server && npm run dev"
echo "  Frontend: npm run dev"
echo ""
echo "Database Admin: http://localhost:5050"
echo "  Email: admin@$YOUR_DOMAIN"
echo "  Password: $DB_PASSWORD"
EOF

chmod +x setup.sh

# Create deployment script
echo "Creating deploy.sh script..."
cat > deploy.sh << EOF
#!/bin/bash

echo "🚀 Deploying $PROJECT_NAME..."
echo "=============================="

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Build backend
echo "🏗️ Building backend..."
cd server && npm run build && cd ..

# Copy production environment files
echo "📋 Setting up production environment..."
cp .env.production .env
cp server/.env.production server/.env

echo "✅ Deployment files ready!"
echo ""
echo "Next steps:"
echo "1. Upload files to your server"
echo "2. Install dependencies: npm install && cd server && npm install"
echo "3. Setup database: npx prisma db push"
echo "4. Start with PM2: pm2 start server/dist/index.js --name $PROJECT_NAME"
echo "5. Serve frontend with nginx or similar"
EOF

chmod +x deploy.sh

echo ""
echo "✅ Template customization complete!"
echo ""
echo "📁 Files created/updated:"
echo "  - README.md (customized)"
echo "  - server/.env (development)"
echo "  - .env (frontend development)"
echo "  - server/.env.production"
echo "  - .env.production"
echo "  - docker-compose.yml"
echo "  - setup.sh"
echo "  - deploy.sh"
echo ""
echo "🚀 Next steps:"
echo "1. Run: ./setup.sh"
echo "2. Start development servers"
echo "3. Customize your application"
echo "4. Deploy when ready"
echo ""
echo "🔑 Important:"
echo "  - JWT Secret: $JWT_SECRET"
echo "  - Database: $DB_NAME"
echo "  - Domain: $YOUR_DOMAIN"
echo ""
