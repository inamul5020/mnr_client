# 📝 **Bolt.new Template Usage Example**

**Step-by-step example of using the bolt.new backend template to generate a new feature.**

---

## 🎯 **Scenario: Adding Event Management**

Let's say you want to add event management to your masjid SaaS. Here's how to use the template:

---

## **Step 1: Use the Quick Start Prompt**

Copy this to bolt.new:

```
Create a Node.js + Express + TypeScript backend API with:

**Tech Stack**: Express + TypeScript + PostgreSQL + JWT Auth
**Architecture**: Multi-tenant SaaS with role-based access control

**Required Structure**:
- src/index.ts (main server)
- src/database/connection.ts (PostgreSQL connection)
- src/middleware/auth.ts (JWT authentication)
- src/middleware/errorHandler.ts (error handling)
- src/routes/events.ts (API routes)
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

## **Step 2: Add Event-Specific Routes**

After the basic backend is generated, add this prompt:

```
Add event management to the existing backend:

**New Routes**:
- GET /api/events/:masjidId (list with pagination)
- POST /api/events/:masjidId (create)
- GET /api/events/:masjidId/:id (get single)
- PUT /api/events/:masjidId/:id (update)
- DELETE /api/events/:masjidId/:id (delete)

**Database Table**: events
**Required Fields**: 
- title (string, required)
- description (string, optional)
- event_date (date, required)
- event_time (time, required)
- location (string, optional)
- max_attendees (number, optional)
- registration_required (boolean, default false)

**Validation Rules**:
- title: required, min 3 chars, max 100 chars
- description: optional, max 500 chars
- event_date: required, must be future date
- event_time: required, valid time format
- location: optional, max 200 chars
- max_attendees: optional, positive integer

**Authentication**: All routes require JWT token
**Authorization**: Create/Update/Delete require admin/staff role
**Multi-tenant**: All operations scoped to masjid_id

Follow the existing code patterns and TypeScript interfaces.
```

---

## **Step 3: Add Database Schema**

Add this prompt to update the Prisma schema:

```
Add this database table to the Prisma schema:

```prisma
model Event {
  id                    String   @id @default(uuid())
  masjidId              String
  title                 String
  description           String?
  eventDate             DateTime
  eventTime             String
  location              String?
  maxAttendees          Int?
  registrationRequired  Boolean  @default(false)
  status                Status   @default(active)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  masjid Masjid @relation(fields: [masjidId], references: [id], onDelete: Cascade)

  @@map("events")
}
```

Update the Masjid model to include the relation:
```prisma
events Event[]
```

Generate the complete updated schema file.
```

---

## **Step 4: Add Search and Filtering**

Enhance the list endpoint with this prompt:

```
Add search and filtering to events list endpoint:

**Query Parameters**:
- search (text search across title, description, location)
- status (active, inactive, archived)
- date_from, date_to (date range filtering)
- registration_required (true/false)
- sort_by (event_date, title, created_at)
- sort_order (asc, desc)

**Implementation**:
- Dynamic WHERE clauses
- ILIKE for case-insensitive search
- Date range filtering
- ORDER BY with dynamic columns
- Maintain pagination

**Example**: GET /api/events/:masjidId?search=ramadan&status=active&date_from=2025-01-01&sort_by=event_date&sort_order=asc

Generate the enhanced list endpoint with all filtering options.
```

---

## **Step 5: Add Dashboard Stats**

Add event statistics to the dashboard:

```
Add event statistics to the dashboard stats endpoint:

**Update Route**: GET /api/members/:masjidId/stats

**Add to Response**:
```json
{
  "events": {
    "total_events": "count",
    "upcoming_events": "count",
    "this_month_events": "count",
    "registration_required_events": "count"
  }
}
```

**SQL Queries**:
- total_events: COUNT(*) FROM events WHERE masjid_id = ?
- upcoming_events: COUNT(*) WHERE event_date >= NOW()
- this_month_events: COUNT(*) WHERE event_date >= start_of_month
- registration_required_events: COUNT(*) WHERE registration_required = true

Generate the updated stats endpoint with event statistics.
```

---

## **Step 6: Add Validation**

Add comprehensive validation:

```
Add comprehensive input validation for events:

**Validation Rules**:
- title: required, not empty, min 3 chars, max 100 chars
- description: optional, max 500 chars if provided
- event_date: required, valid date, must be future date
- event_time: required, valid time format (HH:MM)
- location: optional, max 200 chars if provided
- max_attendees: optional, positive integer if provided
- registration_required: optional, boolean

**Using express-validator**:
```typescript
[
  body('title').notEmpty().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description too long'),
  body('event_date').isISO8601().custom((value) => {
    if (new Date(value) < new Date()) {
      throw new Error('Event date must be in the future');
    }
    return true;
  }),
  body('event_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
  body('location').optional().isLength({ max: 200 }).withMessage('Location too long'),
  body('max_attendees').optional().isInt({ min: 1 }).withMessage('Max attendees must be positive'),
  body('registration_required').optional().isBoolean()
]
```

Generate validation for all event endpoints with proper error messages.
```

---

## **Step 7: Test the API**

Add this prompt to generate tests:

```
Add comprehensive API testing for events:

**Test Coverage**:
- Authentication (valid/invalid tokens)
- CRUD operations (create, read, update, delete)
- Validation (required fields, data types, business rules)
- Authorization (role-based access)
- Multi-tenant (masjid_id scoping)
- Search and filtering
- Pagination

**Test Framework**: Jest + Supertest

**Test Structure**:
- Setup/teardown with test database
- Mock JWT tokens for different roles
- Test data fixtures
- Assertion helpers

**Example Test Cases**:
- Create event with valid data
- Create event with missing required fields
- Update event as admin
- Update event as member (should fail)
- List events with search
- List events with date filter

Generate complete test suite with setup and example tests.
```

---

## **Step 8: Production Ready**

Make it production-ready:

```
Prepare events API for production deployment:

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

## ✅ **Result**

After following these steps, you'll have:

1. **Complete Event Management API** with full CRUD operations
2. **Proper Authentication** and authorization
3. **Multi-tenant Architecture** with masjid_id scoping
4. **Comprehensive Validation** and error handling
5. **Search and Filtering** capabilities
6. **Dashboard Integration** with statistics
7. **Production Ready** configuration
8. **Complete Test Suite** for quality assurance

---

## 💡 **Pro Tips**

1. **Start with the basic backend** first, then add features incrementally
2. **Always specify the tech stack** and architecture
3. **Include validation rules** and business logic
4. **Request TypeScript types** for all interfaces
5. **Ask for error handling** and proper HTTP status codes
6. **Include pagination** for list endpoints
7. **Specify response formats** for consistency
8. **Test each step** before moving to the next

---

**Template Version**: 1.0  
**Last Updated**: September 2025  
**Compatibility**: Node.js 18+, PostgreSQL 14+, TypeScript 5+
