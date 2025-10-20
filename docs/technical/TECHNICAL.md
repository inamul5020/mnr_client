# Technical Documentation

## System Architecture

### Overview

The MNR Client Intake System is a full-stack web application built with modern technologies, designed for scalability, security, and maintainability.

### Technology Stack

**Frontend:**
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Hook Form for form management
- Axios for HTTP requests
- Lucide React for icons

**Backend:**
- Node.js with Express.js
- TypeScript for type safety
- Prisma ORM for database operations
- JWT for authentication
- Express Validator for input validation
- ExcelJS and csv-writer for exports

**Database:**
- PostgreSQL 15
- Prisma schema management
- Connection pooling
- Automated migrations

**Infrastructure:**
- Docker containerization
- Docker Compose for orchestration
- Nginx for reverse proxy
- Multi-stage builds for optimization

## Database Schema

### Entity Relationship Diagram

```
User (1) ----< AuditLog (N)
User (1) ----< ClientIntake (N) [createdBy]

ClientIntake (1) ----< RelatedParty (N)
ClientIntake (1) ----< AuditLog (N)
```

### Detailed Schema

#### ClientIntake Model
```prisma
model ClientIntake {
  id          String   @id @default(cuid())
  
  // Section A - Organization
  legalName   String
  tradeName   String?
  type        ClientType
  ownerName   String
  address     String
  city        String?
  state       String?
  zipCode     String?
  country     String?
  phoneMobile String
  phoneLand   String?
  email       String
  website     String?
  natureOfBusiness String
  industry    String?
  clientPriority ClientPriority @default(MEDIUM)
  
  // Section B - Services
  servicesSelected String[]
  serviceFrequency String?
  tin             String?
  
  // Section C - Tax Profile
  taxTypesSelected String[]
  otherRegistrations String?
  
  // Section D - Company Details
  companySecretary String?
  registrationNumber String?
  incorporationDate DateTime?
  annualRevenue   Decimal? @db.Decimal(15, 2)
  employeeCount   Int?
  
  // Section E - RAMIS & Documents
  ramisStatus     RamisStatus
  ramisEmail      String?
  docsBusinessReg Boolean @default(false)
  docsDeed        Boolean @default(false)
  docsVehicleReg  Boolean @default(false)
  docsOther1      String?
  docsOther2      String?
  complianceNotes String?
  
  // Section F - Financial Terms
  creditLimit     Decimal? @db.Decimal(15, 2)
  paymentTerms    String?
  preferredCurrency String? @default("USD")
  
  // Metadata
  notes           String? @db.Text
  consent         Boolean
  submittedAt     DateTime @default(now())
  createdBy       String?
  updatedBy       String?
  deletedBy       String?
  deletedAt       DateTime?
  
  // Relations
  relatedParties  RelatedParty[]
  auditLogs       AuditLog[]
  
  @@map("client_intakes")
}
```

#### User Model
```prisma
model User {
  id          String   @id @default(cuid())
  username    String   @unique
  password    String
  fullName    String
  role        UserRole @default(STAFF)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  auditLogs   AuditLog[]
  
  @@map("users")
}
```

#### RelatedParty Model
```prisma
model RelatedParty {
  id          String   @id @default(cuid())
  clientIntakeId String
  name        String
  relationship String
  tin         String?
  email       String?
  phone       String?
  createdAt   DateTime @default(now())
  
  // Relations
  clientIntake ClientIntake @relation(fields: [clientIntakeId], references: [id], onDelete: Cascade)
  
  @@map("related_parties")
}
```

#### AuditLog Model
```prisma
model AuditLog {
  id          String   @id @default(cuid())
  action      AuditAction
  entityType  String
  entityId    String
  oldValues   Json?
  newValues   Json?
  userId      String
  clientIntakeId String?
  timestamp   DateTime @default(now())
  ipAddress   String?
  userAgent   String?
  
  // Relations
  user        User     @relation(fields: [userId], references: [id])
  clientIntake ClientIntake? @relation(fields: [clientIntakeId], references: [id])
  
  @@map("audit_logs")
}
```

### Enums

```prisma
enum ClientType {
  INDIVIDUAL
  PARTNERSHIP
  COMPANY
  NGO
  OTHER
}

enum ClientPriority {
  LOW
  MEDIUM
  HIGH
  VIP
}

enum RamisStatus {
  AVAILABLE
  NOT_AVAILABLE
}

enum UserRole {
  ADMIN
  MANAGER
  STAFF
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  VIEW
  EXPORT
}
```

## API Architecture

### RESTful Design

The API follows REST principles with clear resource-based URLs and HTTP methods.

**Base URL:** `http://localhost:3001/api`

### Authentication Flow

1. **Login Request**
   ```http
   POST /api/auth/login
   Content-Type: application/json
   
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

2. **JWT Token Response**
   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": { "id": "admin", "role": "ADMIN" }
   }
   ```

3. **Authenticated Requests**
   ```http
   Authorization: Bearer <jwt_token>
   ```

### Middleware Stack

```typescript
// Request Pipeline
Request → CORS → Helmet → Rate Limit → Morgan → Auth → Validation → Route Handler → Response
```

**Middleware Order:**
1. **CORS** - Cross-origin resource sharing
2. **Helmet** - Security headers
3. **Rate Limiting** - Request throttling
4. **Morgan** - Request logging
5. **Authentication** - JWT verification
6. **Validation** - Input validation
7. **Route Handler** - Business logic

### Error Handling

**Error Response Format:**
```json
{
  "error": "Error Type",
  "message": "Human-readable message",
  "details": "Additional information"
}
```

**Error Types:**
- `ValidationError` (400) - Input validation failed
- `AuthenticationError` (401) - Authentication required
- `AuthorizationError` (403) - Insufficient permissions
- `NotFoundError` (404) - Resource not found
- `InternalError` (500) - Server error

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── form/           # Form section components
│   │   ├── SectionA.tsx
│   │   ├── SectionB.tsx
│   │   ├── SectionC.tsx
│   │   ├── SectionD.tsx
│   │   ├── SectionE.tsx
│   │   └── SectionF.tsx
│   ├── ClientDetailView.tsx
│   ├── LoginForm.tsx
│   └── Header.tsx
├── contexts/
│   └── AuthContext.tsx
├── pages/
│   ├── ClientIntakeForm.tsx
│   ├── AdminDashboard.tsx
│   └── SuccessPage.tsx
├── lib/
│   └── api.ts
├── types/
│   └── index.ts
└── App.tsx
```

### State Management

**Authentication State:**
- Global authentication context
- JWT token storage in localStorage
- Automatic token refresh
- User role management

**Form State:**
- React Hook Form for form management
- Zod validation schema
- Multi-step form navigation
- Real-time validation

**API State:**
- Axios interceptors for authentication
- Error handling and retry logic
- Request/response logging
- Loading states

### Routing

**Route Structure:**
- `/` - Client intake form (protected)
- `/admin` - Admin dashboard (protected)
- `/success` - Success page (protected)
- `/login` - Login page (public)

**Route Protection:**
- Authentication required for all routes except login
- Role-based access control
- Automatic redirect to login
- Protected route wrapper component

## Security Implementation

### Authentication & Authorization

**JWT Implementation:**
- RS256 algorithm for token signing
- 8-hour token expiration
- Secure token storage
- Automatic token refresh

**Password Security:**
- bcrypt hashing with salt rounds
- Password strength requirements
- Account lockout after failed attempts
- Secure password reset flow

**Session Management:**
- Stateless JWT authentication
- Token blacklisting for logout
- Secure cookie settings
- CSRF protection

### Data Protection

**Input Validation:**
- Server-side validation with Express Validator
- Client-side validation with Zod
- SQL injection prevention
- XSS protection

**Data Encryption:**
- HTTPS for data in transit
- Database encryption at rest
- Sensitive data masking
- Secure key management

**Access Control:**
- Role-based permissions
- Resource-level authorization
- Audit logging for all actions
- Principle of least privilege

### Security Headers

```typescript
// Helmet configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
```

## Performance Optimization

### Frontend Optimization

**Bundle Optimization:**
- Vite for fast builds
- Code splitting by routes
- Tree shaking for unused code
- Asset optimization

**Runtime Performance:**
- React.memo for component memoization
- useCallback for function memoization
- useMemo for expensive calculations
- Lazy loading for components

**Caching Strategy:**
- Browser caching for static assets
- Service worker for offline support
- Local storage for user preferences
- Memory caching for API responses

### Backend Optimization

**Database Optimization:**
- Connection pooling
- Query optimization
- Indexing strategy
- Pagination for large datasets

**API Optimization:**
- Response compression
- Request batching
- Caching headers
- Rate limiting

**Memory Management:**
- Garbage collection tuning
- Memory leak prevention
- Resource cleanup
- Monitoring and alerting

### Docker Optimization

**Multi-stage Builds:**
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
```

**Image Optimization:**
- Alpine Linux base images
- Multi-stage builds
- Layer caching
- Security scanning

## Monitoring & Logging

### Application Logging

**Log Levels:**
- `ERROR` - System errors and exceptions
- `WARN` - Warning conditions
- `INFO` - General information
- `DEBUG` - Detailed debug information

**Log Format:**
```json
{
  "timestamp": "2025-10-18T09:23:02.625Z",
  "level": "INFO",
  "message": "User login successful",
  "userId": "admin",
  "ipAddress": "127.0.0.1",
  "userAgent": "Mozilla/5.0...",
  "requestId": "req_123456"
}
```

**Log Aggregation:**
- Centralized logging with Winston
- Structured JSON format
- Log rotation and retention
- Real-time monitoring

### Performance Monitoring

**Metrics Tracked:**
- Response times
- Throughput (requests/second)
- Error rates
- Database query performance
- Memory usage
- CPU utilization

**Monitoring Tools:**
- Application performance monitoring
- Database performance insights
- Infrastructure monitoring
- Alert management

### Health Checks

**Health Endpoints:**
```typescript
// Basic health check
GET /health
Response: { "status": "ok", "timestamp": "2025-10-18T09:23:02.625Z" }

// Detailed health check
GET /health/detailed
Response: {
  "status": "ok",
  "database": "connected",
  "memory": "85%",
  "uptime": "2h 30m"
}
```

## Testing Strategy

### Unit Testing

**Frontend Tests:**
- Component testing with React Testing Library
- Hook testing with React Hooks Testing Library
- Utility function testing with Jest
- Mock API responses

**Backend Tests:**
- API endpoint testing with Supertest
- Database testing with Prisma test client
- Middleware testing
- Error handling tests

### Integration Testing

**API Integration:**
- End-to-end API testing
- Database integration tests
- Authentication flow testing
- Error scenario testing

**Frontend Integration:**
- User interaction testing
- Form submission testing
- Navigation testing
- Error handling testing

### End-to-End Testing

**User Flows:**
- Complete user registration flow
- Form submission process
- Admin dashboard operations
- Export functionality

**Browser Testing:**
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility testing
- Performance testing

## Deployment Architecture

### Container Strategy

**Service Containers:**
- `frontend` - React application with Nginx
- `backend` - Node.js API server
- `postgres` - PostgreSQL database

**Container Communication:**
- Internal Docker network
- Service discovery
- Health checks
- Load balancing

### Environment Configuration

**Environment Variables:**
```bash
# Database
DATABASE_URL=postgresql://user:pass@postgres:5432/mnr_client

# Authentication
JWT_SECRET=your-super-secret-key

# Application
NODE_ENV=production
PORT=3001

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

**Configuration Management:**
- Environment-specific configs
- Secret management
- Configuration validation
- Runtime configuration

### Scaling Strategy

**Horizontal Scaling:**
- Multiple backend instances
- Load balancer configuration
- Database read replicas
- CDN for static assets

**Vertical Scaling:**
- Resource allocation
- Performance tuning
- Memory optimization
- CPU optimization

## Maintenance Procedures

### Database Maintenance

**Regular Tasks:**
- Database backups
- Index optimization
- Query performance analysis
- Data cleanup

**Migration Management:**
- Schema versioning
- Migration rollback procedures
- Data migration scripts
- Testing migrations

### Application Maintenance

**Code Updates:**
- Dependency updates
- Security patches
- Feature releases
- Bug fixes

**Deployment Process:**
- Blue-green deployment
- Rolling updates
- Rollback procedures
- Health checks

### Monitoring Maintenance

**Alert Management:**
- Alert threshold tuning
- Notification configuration
- Escalation procedures
- Alert fatigue prevention

**Log Management:**
- Log rotation
- Log retention policies
- Log analysis
- Log archiving

---

**Technical documentation maintained by the development team.**
