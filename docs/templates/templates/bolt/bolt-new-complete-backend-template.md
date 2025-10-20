# 🚀 **Bolt.new Complete Backend API Template**

**A comprehensive template for generating a complete backend API that works seamlessly with any frontend project, avoiding all common integration errors.**

---

## 📋 **Project Context**

**Use Case**: Frontend project with Supabase-like API calls that needs a complete backend replacement  
**Tech Stack**: Node.js + Express + TypeScript + PostgreSQL + Prisma  
**Architecture**: RESTful API with JWT authentication, role-based access control, and multi-tenant support  
**Goal**: Generate a backend that works out-of-the-box with existing frontend code  

---

## 🎯 **Bolt.new Prompt Template**

```
Create a complete Node.js + Express + TypeScript backend API that replaces Supabase functionality for a frontend project.

**CRITICAL REQUIREMENTS - MUST FOLLOW EXACTLY:**

## 1. PROJECT STRUCTURE
```
backend/
├── src/
│   ├── index.ts                 # Main server file
│   ├── database/
│   │   ├── connection.ts        # PostgreSQL connection with pooling
│   │   └── migrations/          # SQL migration files
│   ├── middleware/
│   │   ├── auth.ts             # JWT authentication middleware
│   │   ├── errorHandler.ts     # Comprehensive error handling
│   │   ├── validation.ts       # Input validation middleware
│   │   └── cors.ts             # CORS configuration
│   ├── routes/
│   │   ├── auth.ts             # Authentication routes
│   │   ├── [entity].ts         # CRUD routes for each entity
│   │   └── index.ts            # Route aggregation
│   ├── services/
│   │   ├── authService.ts      # Authentication business logic
│   │   ├── [entity]Service.ts  # Business logic for each entity
│   │   └── emailService.ts     # Email functionality
│   ├── utils/
│   │   ├── logger.ts           # Logging utility
│   │   ├── encryption.ts       # Password hashing, JWT
│   │   └── validators.ts       # Custom validation functions
│   └── types/
│       ├── auth.ts             # Authentication types
│       ├── [entity].ts         # Entity-specific types
│       └── common.ts           # Common types and interfaces
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Database seeding
│   └── migrations/             # Prisma migrations
├── .env                        # Environment variables
├── .env.example                # Environment template
├── package.json                # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── docker-compose.yml          # PostgreSQL container
└── README.md                   # Setup instructions
```

## 2. ESSENTIAL DEPENDENCIES
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "pg": "^8.11.3",
    "dotenv": "^16.3.1",
    "express-validator": "^7.0.1",
    "compression": "^1.7.4",
    "morgan": "^1.10.0",
    "nodemailer": "^6.9.7",
    "uuid": "^9.0.1",
    "joi": "^17.11.0"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcryptjs": "^2.4.6",
    "@types/pg": "^8.10.9",
    "@types/compression": "^1.7.5",
    "@types/morgan": "^1.9.9",
    "@types/nodemailer": "^6.4.14",
    "@types/uuid": "^9.0.7",
    "tsx": "^4.6.2",
    "nodemon": "^3.0.2",
    "prisma": "^5.6.0",
    "@prisma/client": "^5.6.0"
  }
}
```

## 3. CORE IMPLEMENTATION REQUIREMENTS

### A. SERVER SETUP (src/index.ts)
- Express server with all security middleware
- CORS configured for localhost:5173, localhost:5174, and production domains
- Rate limiting: 100 requests per 15 minutes per IP
- Helmet security headers
- Compression middleware
- Morgan request logging
- Health check endpoint at /health
- Error handling middleware (must be last)
- Graceful shutdown handling

### B. DATABASE CONNECTION (src/database/connection.ts)
- PostgreSQL connection pooling (min: 2, max: 10 connections)
- Connection retry logic with exponential backoff
- Query logging in development
- Transaction support
- Connection health monitoring
- Proper error handling and cleanup

### C. AUTHENTICATION SYSTEM (src/middleware/auth.ts)
- JWT token validation middleware
- Role-based access control (admin, user, guest)
- Token refresh mechanism
- Password reset functionality
- Account verification system
- Session management

### D. ERROR HANDLING (src/middleware/errorHandler.ts)
- Centralized error handling
- Custom error classes
- Proper HTTP status codes
- Error logging with stack traces
- Development vs production error responses
- Validation error formatting

### E. INPUT VALIDATION (src/middleware/validation.ts)
- Express-validator integration
- Custom validation rules
- Sanitization of inputs
- File upload validation
- SQL injection prevention
- XSS protection

## 4. API ROUTE STRUCTURE

### A. AUTHENTICATION ROUTES (/api/auth)
- POST /login - User login with email/password
- POST /register - User registration
- POST /refresh - Token refresh
- POST /forgot-password - Password reset request
- POST /reset-password - Password reset confirmation
- POST /verify-email - Email verification
- POST /logout - User logout
- GET /me - Get current user profile
- PUT /me - Update user profile

### B. ENTITY CRUD ROUTES (/api/[entity])
For each entity, implement:
- GET / - List with pagination, search, filtering, sorting
- GET /:id - Get single item
- POST / - Create new item
- PUT /:id - Update item
- PATCH /:id - Partial update
- DELETE /:id - Delete item
- GET /:id/related - Get related items

### C. RESPONSE FORMAT STANDARDIZATION
```json
{
  "success": true,
  "data": {}, // or []
  "message": "Operation successful",
  "pagination": { // for list endpoints
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  },
  "meta": {
    "timestamp": "2025-01-01T00:00:00Z",
    "requestId": "uuid"
  }
}
```

## 5. DATABASE SCHEMA REQUIREMENTS

### A. CORE TABLES (MUST INCLUDE)
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  firstName String
  lastName  String
  role      Role     @default(user)
  isActive  Boolean  @default(true)
  emailVerified Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  sessions  Session[]
  auditLogs AuditLog[]

  @@map("users")
}

model Session {
  id        String   @id @default(uuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model AuditLog {
  id        String   @id @default(uuid())
  userId    String
  action    String
  resource  String
  details   Json?
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("audit_logs")
}
```

### B. ENTITY TEMPLATE
```prisma
model [Entity] {
  id        String   @id @default(uuid())
  name      String
  description String?
  status    Status   @default(active)
  metadata  Json?    // For flexible additional fields
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  createdBy String
  creator   User   @relation(fields: [createdBy], references: [id])

  @@map("[entity_table]")
}
```

## 6. SECURITY REQUIREMENTS

### A. AUTHENTICATION
- JWT tokens with 15-minute expiration
- Refresh tokens with 7-day expiration
- Password hashing with bcrypt (12 rounds)
- Account lockout after 5 failed attempts
- Email verification required

### B. AUTHORIZATION
- Role-based access control (RBAC)
- Resource-level permissions
- API key authentication for external services
- Rate limiting per user and IP

### C. DATA PROTECTION
- Input sanitization and validation
- SQL injection prevention
- XSS protection
- CSRF protection
- Sensitive data encryption

## 7. PERFORMANCE OPTIMIZATIONS

### A. DATABASE
- Connection pooling
- Query optimization
- Indexing strategy
- Caching layer (Redis ready)
- Database migrations

### B. API
- Response compression
- Request caching
- Pagination for all list endpoints
- Lazy loading for related data
- API versioning support

### C. MONITORING
- Request/response logging
- Error tracking
- Performance metrics
- Health checks
- Database query monitoring

## 8. ENVIRONMENT CONFIGURATION

### A. ENVIRONMENT VARIABLES (.env)
```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/database_name
DB_POOL_MIN=2
DB_POOL_MAX=10

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development
API_VERSION=v1

# CORS
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret
```

### B. PACKAGE.JSON SCRIPTS
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix"
  }
}
```

## 9. FRONTEND INTEGRATION REQUIREMENTS

### A. API CLIENT COMPATIBILITY
- Supabase-like API structure
- Consistent response formats
- Error handling compatibility
- Authentication token management
- Real-time subscriptions (WebSocket ready)

### B. CORS CONFIGURATION
- Support for localhost:5173 (Vite default)
- Support for localhost:5174 (alternative port)
- Production domain support
- Credentials support
- Preflight request handling

### C. ERROR HANDLING
- Consistent error response format
- Proper HTTP status codes
- Frontend-friendly error messages
- Validation error details
- Network error handling

## 10. TESTING REQUIREMENTS

### A. TEST STRUCTURE
- Unit tests for services
- Integration tests for routes
- Database tests with test DB
- Authentication tests
- Error handling tests

### B. TEST SETUP
- Jest configuration
- Test database setup
- Mock data fixtures
- Test utilities
- Coverage reporting

## 11. DEPLOYMENT READINESS

### A. PRODUCTION CONFIGURATION
- Environment-specific configs
- Security hardening
- Performance optimization
- Monitoring setup
- Health checks

### B. DOCKER SUPPORT
- Dockerfile for backend
- Docker-compose for full stack
- Multi-stage builds
- Production optimizations

## 12. DOCUMENTATION REQUIREMENTS

### A. API DOCUMENTATION
- OpenAPI/Swagger specification
- Endpoint documentation
- Request/response examples
- Authentication guide
- Error code reference

### B. SETUP DOCUMENTATION
- Installation instructions
- Environment setup
- Database setup
- Development workflow
- Deployment guide

## CRITICAL SUCCESS CRITERIA:

1. **Zero Configuration**: Backend must work immediately after generation
2. **Frontend Compatibility**: Must work with existing Supabase-like frontend code
3. **Error-Free**: No common integration errors (CORS, authentication, validation)
4. **Production Ready**: Security, performance, and monitoring built-in
5. **Scalable**: Multi-tenant architecture with proper database design
6. **Maintainable**: Clean code structure with proper TypeScript types
7. **Testable**: Complete test suite with good coverage
8. **Documented**: Comprehensive documentation and examples

## GENERATION INSTRUCTIONS:

1. Generate the complete backend structure
2. Implement all core functionality
3. Add comprehensive error handling
4. Include security best practices
5. Add performance optimizations
6. Create complete test suite
7. Add documentation and examples
8. Ensure frontend compatibility
9. Include deployment configuration
10. Add monitoring and logging

Generate a production-ready backend that can immediately replace Supabase functionality for any frontend project.
```

---

## 🎯 **Additional Optimization Prompts**

### **1. Database Optimization**
```
Add advanced database optimizations to the backend:

**Performance Features**:
- Query result caching with Redis
- Database connection pooling optimization
- Query performance monitoring
- Automatic database indexing
- Connection health checks
- Database migration rollback support
- Backup and restore functionality
- Database query optimization suggestions

**Monitoring**:
- Slow query logging
- Connection pool monitoring
- Database performance metrics
- Query execution time tracking
- Database size monitoring

Generate the optimized database layer with all performance features.
```

### **2. Real-time Features**
```
Add real-time functionality to the backend:

**WebSocket Support**:
- Socket.io integration
- Real-time notifications
- Live data updates
- User presence tracking
- Room-based messaging
- Event broadcasting

**Features**:
- Real-time entity updates
- Live user activity
- Instant notifications
- Collaborative editing support
- Live chat functionality
- Real-time analytics

Generate the real-time backend with WebSocket support.
```

### **3. Advanced Security**
```
Implement advanced security features:

**Security Enhancements**:
- Two-factor authentication (2FA)
- OAuth integration (Google, GitHub)
- API key management
- IP whitelisting
- Advanced rate limiting
- Security headers optimization
- Content Security Policy (CSP)
- HSTS implementation

**Monitoring**:
- Security event logging
- Failed login tracking
- Suspicious activity detection
- Automated security alerts
- Security audit trails

Generate the security-enhanced backend with all advanced features.
```

### **4. File Management**
```
Add comprehensive file management:

**File Features**:
- File upload with validation
- Image processing and resizing
- File storage (local/S3/Cloudinary)
- File access control
- File versioning
- Bulk file operations
- File compression
- Virus scanning integration

**API Endpoints**:
- POST /api/files/upload
- GET /api/files/:id
- DELETE /api/files/:id
- GET /api/files/list
- POST /api/files/bulk-upload

Generate the file management system with all features.
```

### **5. Analytics & Reporting**
```
Add analytics and reporting features:

**Analytics**:
- User activity tracking
- API usage statistics
- Performance metrics
- Error rate monitoring
- Custom event tracking
- Data export functionality

**Reporting**:
- Automated report generation
- Scheduled reports
- Custom report builder
- Data visualization APIs
- Export to PDF/Excel
- Email report delivery

Generate the analytics and reporting system.
```

---

## ✅ **Expected Results**

After using this template, you'll get:

1. **Complete Backend API** that works immediately with any frontend
2. **Zero Integration Errors** - all common issues pre-solved
3. **Production Ready** - security, performance, monitoring built-in
4. **Scalable Architecture** - multi-tenant, role-based, optimized
5. **Comprehensive Testing** - unit, integration, and e2e tests
6. **Full Documentation** - API docs, setup guides, examples
7. **Deployment Ready** - Docker, environment configs, CI/CD
8. **Frontend Compatible** - works with existing Supabase-like code

---

## 🚀 **Usage Instructions**

1. **Copy the main prompt** to bolt.new
2. **Customize entity names** with your specific requirements
3. **Add any additional features** using the optimization prompts
4. **Generate the complete backend**
5. **Test with your frontend** - should work immediately
6. **Deploy to production** - all configurations included

---

**Template Version**: 2.0  
**Last Updated**: September 2025  
**Compatibility**: Any frontend project, Node.js 18+, PostgreSQL 14+, TypeScript 5+
