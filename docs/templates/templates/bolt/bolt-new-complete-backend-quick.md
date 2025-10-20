# ⚡ **Bolt.new Complete Backend - Quick Copy**

**Copy-paste ready prompt for generating a complete backend API that works with any frontend project.**

---

## 🚀 **Main Prompt (Copy This)**

```
Create a complete Node.js + Express + TypeScript backend API that replaces Supabase functionality for a frontend project.

**CRITICAL REQUIREMENTS - MUST FOLLOW EXACTLY:**

## PROJECT STRUCTURE
```
backend/
├── src/
│   ├── index.ts                 # Main server file
│   ├── database/connection.ts   # PostgreSQL connection with pooling
│   ├── middleware/
│   │   ├── auth.ts             # JWT authentication
│   │   ├── errorHandler.ts     # Error handling
│   │   └── validation.ts       # Input validation
│   ├── routes/
│   │   ├── auth.ts             # Authentication routes
│   │   └── [entity].ts         # CRUD routes for each entity
│   ├── services/
│   │   ├── authService.ts      # Authentication logic
│   │   └── [entity]Service.ts  # Business logic
│   └── types/
│       ├── auth.ts             # Authentication types
│       └── [entity].ts         # Entity types
├── prisma/schema.prisma        # Database schema
├── .env                        # Environment variables
└── package.json                # Dependencies
```

## ESSENTIAL DEPENDENCIES
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
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcryptjs": "^2.4.6",
    "@types/pg": "^8.10.9",
    "tsx": "^4.6.2",
    "nodemon": "^3.0.2",
    "prisma": "^5.6.0",
    "@prisma/client": "^5.6.0"
  }
}
```

## CORE REQUIREMENTS

### 1. SERVER SETUP (src/index.ts)
- Express server with security middleware
- CORS for localhost:5173, localhost:5174, and production
- Rate limiting: 100 requests per 15 minutes
- Helmet security headers
- Compression and logging
- Health check at /health
- Error handling middleware

### 2. DATABASE (src/database/connection.ts)
- PostgreSQL connection pooling (min: 2, max: 10)
- Connection retry logic
- Query logging in development
- Transaction support
- Health monitoring

### 3. AUTHENTICATION (src/middleware/auth.ts)
- JWT token validation
- Role-based access control (admin, user, guest)
- Token refresh mechanism
- Password reset functionality
- Session management

### 4. ERROR HANDLING (src/middleware/errorHandler.ts)
- Centralized error handling
- Custom error classes
- Proper HTTP status codes
- Error logging with stack traces
- Development vs production responses

### 5. API ROUTES
**Authentication (/api/auth)**:
- POST /login, /register, /refresh
- POST /forgot-password, /reset-password
- GET /me, PUT /me

**Entity CRUD (/api/[entity])**:
- GET / (list with pagination, search, filtering)
- GET /:id (get single)
- POST / (create)
- PUT /:id (update)
- DELETE /:id (delete)

### 6. RESPONSE FORMAT
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 7. DATABASE SCHEMA
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  firstName String
  lastName  String
  role      Role     @default(user)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model [Entity] {
  id        String   @id @default(uuid())
  name      String
  description String?
  status    Status   @default(active)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 8. ENVIRONMENT VARIABLES
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/database_name
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 9. SECURITY REQUIREMENTS
- JWT tokens (15min expiration, 7day refresh)
- Password hashing with bcrypt (12 rounds)
- Account lockout after 5 failed attempts
- Input sanitization and validation
- SQL injection prevention
- XSS protection
- CSRF protection

### 10. PERFORMANCE OPTIMIZATIONS
- Connection pooling
- Response compression
- Request caching
- Pagination for all lists
- Query optimization
- Health checks

## CRITICAL SUCCESS CRITERIA:
1. **Zero Configuration**: Works immediately after generation
2. **Frontend Compatible**: Works with existing Supabase-like code
3. **Error-Free**: No CORS, authentication, or validation errors
4. **Production Ready**: Security, performance, monitoring built-in
5. **Scalable**: Multi-tenant with proper database design
6. **Maintainable**: Clean TypeScript code with proper types
7. **Testable**: Complete test suite included
8. **Documented**: Comprehensive documentation

Generate a production-ready backend that immediately replaces Supabase functionality for any frontend project.
```

---

## 🔧 **Additional Feature Prompts**

### **Real-time Features**
```
Add real-time functionality to the backend:

**WebSocket Support**:
- Socket.io integration
- Real-time notifications
- Live data updates
- User presence tracking
- Event broadcasting

**Features**:
- Real-time entity updates
- Live user activity
- Instant notifications
- Collaborative editing

Generate the real-time backend with WebSocket support.
```

### **File Management**
```
Add comprehensive file management:

**File Features**:
- File upload with validation
- Image processing and resizing
- File storage (local/S3)
- File access control
- Bulk file operations

**API Endpoints**:
- POST /api/files/upload
- GET /api/files/:id
- DELETE /api/files/:id
- GET /api/files/list

Generate the file management system.
```

### **Advanced Security**
```
Implement advanced security features:

**Security Enhancements**:
- Two-factor authentication (2FA)
- OAuth integration (Google, GitHub)
- API key management
- IP whitelisting
- Advanced rate limiting
- Security event logging

Generate the security-enhanced backend.
```

### **Analytics & Reporting**
```
Add analytics and reporting features:

**Analytics**:
- User activity tracking
- API usage statistics
- Performance metrics
- Custom event tracking

**Reporting**:
- Automated report generation
- Data export functionality
- Custom report builder
- Email report delivery

Generate the analytics and reporting system.
```

---

## 💡 **Pro Tips**

1. **Always specify the exact tech stack** (Express + TypeScript + PostgreSQL)
2. **Mention CORS origins** (localhost:5173, localhost:5174)
3. **Request TypeScript types** for all interfaces
4. **Ask for comprehensive error handling**
5. **Include pagination** for all list endpoints
6. **Specify response formats** for consistency
7. **Request production-ready configuration**
8. **Ask for complete test suite**

---

## ✅ **Expected Results**

After using this template, you'll get:

- ✅ **Complete Backend API** that works immediately
- ✅ **Zero Integration Errors** - all issues pre-solved
- ✅ **Production Ready** - security, performance, monitoring
- ✅ **Scalable Architecture** - multi-tenant, role-based
- ✅ **Frontend Compatible** - works with existing code
- ✅ **Comprehensive Testing** - unit, integration tests
- ✅ **Full Documentation** - API docs, setup guides
- ✅ **Deployment Ready** - Docker, environment configs

---

**Quick Copy**: Use the main prompt above as your starting point, then add specific feature prompts as needed.
