# ⚡ **Bolt.new Quick Reference Card**

**Copy-paste ready prompts for generating backend APIs that work with our setup.**

---

## 🎯 **Quick Start Prompt**

```
Create a Node.js + Express + TypeScript backend API with:

**Tech Stack**: Express + TypeScript + PostgreSQL + JWT Auth
**Architecture**: Multi-tenant SaaS with role-based access control

**Required Structure**:
- src/index.ts (main server)
- src/database/connection.ts (PostgreSQL connection)
- src/middleware/auth.ts (JWT authentication)
- src/middleware/errorHandler.ts (error handling)
- src/routes/[feature].ts (API routes)
- .env (environment variables)
- package.json (dependencies)

**Key Features**:
- JWT authentication with role-based access
- Multi-tenant architecture (masjid_id scoping)
- CORS for localhost:5173 and localhost:5174
- Rate limiting and security headers
- Input validation with express-validator
- Comprehensive error handling
- CRUD operations with pagination
- Health check endpoint

**Dependencies**: express, cors, helmet, express-rate-limit, jsonwebtoken, bcryptjs, pg, dotenv, express-validator

Generate complete backend with all files and proper TypeScript types.
```

---

## 🔧 **Feature-Specific Prompt**

```
Add [FEATURE_NAME] management to the existing backend:

**New Routes**:
- GET /api/[feature]/:masjidId (list with pagination)
- POST /api/[feature]/:masjidId (create)
- GET /api/[feature]/:masjidId/:id (get single)
- PUT /api/[feature]/:masjidId/:id (update)
- DELETE /api/[feature]/:masjidId/:id (delete)

**Database Table**: [table_name]
**Required Fields**: [list your fields]
**Validation Rules**: [list validation requirements]

**Authentication**: All routes require JWT token
**Authorization**: Create/Update/Delete require admin/staff role
**Multi-tenant**: All operations scoped to masjid_id

Follow the existing code patterns and TypeScript interfaces.
```

---

## 🗄️ **Database Schema Prompt**

```
Add this database table to the Prisma schema:

```prisma
model [TableName] {
  id          String   @id @default(uuid())
  masjidId    String
  [field1]    String
  [field2]    String?
  [field3]    [Type]   @default([default])
  status      Status   @default(active)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  masjid Masjid @relation(fields: [masjidId], references: [id], onDelete: Cascade)

  @@map("[table_name]")
}
```

Update the Masjid model to include the relation:
```prisma
[tableName] [TableName][]
```

Generate the complete updated schema file.
```

---

## 🔐 **Authentication Prompt**

```
Implement JWT authentication system:

**Routes**:
- POST /api/auth/login (email, password)
- POST /api/auth/register (email, password, name)
- POST /api/auth/refresh (refresh token)

**Middleware**:
- authenticateToken (verify JWT)
- requireMasjidAccess (extract masjid_id)
- requireRole(['admin', 'staff']) (role-based access)

**Security**:
- Password hashing with bcryptjs
- JWT tokens with expiration
- Rate limiting on auth routes
- Input validation

**Response Format**:
```json
{
  "user": { "id", "email", "name", "role" },
  "token": "jwt_token_here"
}
```

Generate complete authentication system with proper error handling.
```

---

## 📊 **Dashboard Stats Prompt**

```
Add dashboard statistics endpoint:

**Route**: GET /api/members/:masjidId/stats

**Return**:
```json
{
  "members": {
    "total_members": "count",
    "active_members": "count", 
    "archived_members": "count"
  },
  "households": {
    "total_households": "count",
    "own_houses": "count",
    "rental_houses": "count"
  },
  "receipts": {
    "today": {
      "today_receipts": "count",
      "today_amount": "total"
    },
    "month": {
      "month_receipts": "count", 
      "month_amount": "total"
    }
  }
}
```

Use SQL queries with COUNT() and SUM() aggregations.
Generate the complete stats endpoint with proper error handling.
```

---

## 🚨 **Error Handling Prompt**

```
Implement comprehensive error handling:

**Error Types**:
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Database errors (500)
- Rate limit errors (429)

**Error Handler Middleware**:
- Log all errors
- Return consistent error format
- Hide sensitive info in production
- Include stack trace in development

**Error Format**:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional info (dev only)"
}
```

Generate complete error handling system with proper logging.
```

---

## 🔍 **Search & Filter Prompt**

```
Add search and filtering to [FEATURE] list endpoint:

**Query Parameters**:
- search (text search across name, description)
- status (active, inactive, archived)
- date_from, date_to (date range)
- sort_by (created_at, name, etc.)
- sort_order (asc, desc)

**Implementation**:
- Dynamic WHERE clauses
- ILIKE for case-insensitive search
- Date range filtering
- ORDER BY with dynamic columns
- Maintain pagination

**Example**: GET /api/[feature]/:masjidId?search=test&status=active&sort_by=created_at&sort_order=desc

Generate the enhanced list endpoint with all filtering options.
```

---

## 📝 **Validation Prompt**

```
Add comprehensive input validation:

**Validation Rules**:
- Required fields
- Data types (string, number, email, date)
- Length limits (min/max)
- Format validation (email, phone, etc.)
- Custom business rules

**Using express-validator**:
```typescript
[
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('age').isInt({ min: 0, max: 120 }).withMessage('Valid age required')
]
```

**Error Response**:
```json
{
  "errors": [
    {
      "field": "email",
      "message": "Valid email required"
    }
  ]
}
```

Generate validation for all input endpoints with proper error messages.
```

---

## 🚀 **Deployment Prompt**

```
Prepare backend for production deployment:

**Environment Variables**:
- DATABASE_URL (production database)
- JWT_SECRET (strong secret key)
- NODE_ENV=production
- PORT (production port)
- FRONTEND_URL (production frontend)

**Security**:
- CORS for production domain
- Rate limiting for production
- Helmet security headers
- Input sanitization
- SQL injection prevention

**Performance**:
- Database connection pooling
- Query optimization
- Response compression
- Caching headers

**Monitoring**:
- Health check endpoint
- Error logging
- Request logging
- Performance metrics

Generate production-ready configuration with all security measures.
```

---

## 📋 **Testing Prompt**

```
Add comprehensive API testing:

**Test Coverage**:
- Authentication endpoints
- CRUD operations
- Error handling
- Validation
- Authorization
- Rate limiting

**Test Framework**: Jest + Supertest

**Test Structure**:
- Setup/teardown
- Mock database
- Test data fixtures
- Assertion helpers

**Test Cases**:
- Valid requests
- Invalid inputs
- Unauthorized access
- Role-based permissions
- Edge cases

Generate complete test suite with setup and example tests.
```

---

## 💡 **Pro Tips**

1. **Always specify the tech stack** (Express + TypeScript + PostgreSQL)
2. **Mention multi-tenant architecture** (masjid_id scoping)
3. **Include authentication requirements** (JWT + role-based)
4. **Specify CORS origins** (localhost:5173, localhost:5174)
5. **Request TypeScript types** for all interfaces
6. **Ask for error handling** and validation
7. **Include pagination** for list endpoints
8. **Specify response formats** for consistency

---

**Quick Copy**: Use the prompts above as starting points and customize the [PLACEHOLDERS] with your specific requirements.
