# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/login
Login with username and password.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "admin",
    "username": "admin",
    "fullName": "System Administrator",
    "role": "ADMIN"
  }
}
```

#### GET /auth/users
Get list of all users (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "admin",
      "username": "admin",
      "fullName": "System Administrator",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "2025-10-18T09:00:00.000Z"
    }
  ]
}
```

### Client Intake

#### POST /intake
Submit a new client intake (requires authentication).

**Request Body:**
```json
{
  "legalName": "ABC Company Ltd",
  "tradeName": "ABC Co",
  "type": "COMPANY",
  "ownerName": "John Smith",
  "address": "123 Business Street, Colombo 03",
  "city": "Colombo",
  "state": "Western Province",
  "zipCode": "00300",
  "country": "Sri Lanka",
  "phoneMobile": "+94 77 123 4567",
  "phoneLand": "+94 11 234 5678",
  "email": "john@abccompany.com",
  "website": "https://www.abccompany.com",
  "natureOfBusiness": "Software development",
  "industry": "Technology",
  "clientPriority": "HIGH",
  "servicesSelected": ["Direct Tax", "Indirect Tax"],
  "serviceFrequency": "Monthly",
  "tin": "123456789V",
  "taxTypesSelected": ["Income Tax", "VAT"],
  "otherRegistrations": "BOI registration",
  "companySecretary": "Jane Doe",
  "registrationNumber": "PV123456",
  "incorporationDate": "2020-01-15",
  "annualRevenue": 5000000,
  "employeeCount": 150,
  "ramisStatus": "AVAILABLE",
  "ramisEmail": "ramis@abccompany.com",
  "docsBusinessReg": true,
  "docsDeed": true,
  "docsVehicleReg": false,
  "docsOther1": "BOI Certificate",
  "docsOther2": "Export License",
  "complianceNotes": "Regular compliance",
  "creditLimit": 100000,
  "paymentTerms": "Net 30",
  "preferredCurrency": "USD",
  "notes": "Long-term client",
  "consent": true,
  "relatedParties": [
    {
      "name": "John Smith",
      "relationship": "Director",
      "tin": "123456789V",
      "email": "john@abccompany.com",
      "phone": "+94 77 123 4567"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Client intake submitted successfully",
  "data": {
    "id": "cmgw2kyu90008o701ln9ocklm",
    "legalName": "ABC Company Ltd",
    "createdBy": "admin",
    "submittedAt": "2025-10-18T09:23:02.625Z",
    "relatedParties": [...]
  }
}
```

#### GET /intake
Get list of client intakes with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `type` (string): Filter by client type
- `service` (string): Filter by service type
- `taxType` (string): Filter by tax type
- `ramisStatus` (string): Filter by RAMIS status
- `search` (string): Search in name, email, owner
- `sortBy` (string): Sort field (default: submittedAt)
- `sortOrder` (string): Sort order - asc/desc (default: desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cmgw2kyu90008o701ln9ocklm",
      "legalName": "ABC Company Ltd",
      "type": "COMPANY",
      "ownerName": "John Smith",
      "email": "john@abccompany.com",
      "submittedAt": "2025-10-18T09:23:02.625Z",
      "createdBy": "admin"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### GET /intake/:id
Get specific client intake by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cmgw2kyu90008o701ln9ocklm",
    "legalName": "ABC Company Ltd",
    "tradeName": "ABC Co",
    "type": "COMPANY",
    "ownerName": "John Smith",
    "address": "123 Business Street, Colombo 03",
    "phoneMobile": "+94 77 123 4567",
    "email": "john@abccompany.com",
    "natureOfBusiness": "Software development",
    "servicesSelected": ["Direct Tax", "Indirect Tax"],
    "ramisStatus": "AVAILABLE",
    "consent": true,
    "submittedAt": "2025-10-18T09:23:02.625Z",
    "createdBy": "admin",
    "relatedParties": [...]
  }
}
```

#### PUT /intake/:id
Update client intake (requires authentication).

**Request Body:**
```json
{
  "legalName": "Updated ABC Company Ltd",
  "tradeName": "Updated ABC Co",
  "type": "COMPANY",
  "ownerName": "Updated John Smith",
  "address": "456 Updated Business Street, Colombo 03",
  "phoneMobile": "+94 77 123 4567",
  "email": "updatedjohn@abccompany.com",
  "natureOfBusiness": "Updated Software development",
  "servicesSelected": ["Direct Tax", "Indirect Tax", "HR Services"],
  "tin": "123456789V",
  "companySecretary": "Updated Secretary",
  "ramisStatus": "AVAILABLE",
  "consent": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Client intake updated successfully",
  "data": {
    "id": "cmgw2kyu90008o701ln9ocklm",
    "legalName": "Updated ABC Company Ltd",
    "updatedBy": "admin",
    "submittedAt": "2025-10-18T09:23:02.625Z",
    "relatedParties": [...]
  }
}
```

#### DELETE /intake/:id
Delete client intake (requires authentication + passcode).

**Request Body:**
```json
{
  "passcode": "MNR_DELETE_2024"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Client intake deleted successfully",
  "deletedBy": "admin",
  "deletedAt": "2025-10-18T09:30:00.000Z"
}
```

### Export

#### GET /export/excel/:id
Export single client to Excel file.

**Response:** Excel file download

#### GET /export/excel/all
Export all clients to Excel file.

**Response:** Excel file download

#### GET /export/csv/:id
Export single client to CSV file.

**Response:** CSV file download

#### GET /export/csv/all
Export all clients to CSV file.

**Response:** CSV file download

### Audit

#### GET /audit/logs
Get audit logs (requires authentication).

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50)
- `sortBy` (string): Sort field (default: timestamp)
- `sortOrder` (string): Sort order - asc/desc (default: desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "audit_123",
      "action": "CREATE",
      "entityType": "ClientIntake",
      "entityId": "cmgw2kyu90008o701ln9ocklm",
      "userId": "admin",
      "user": {
        "username": "admin",
        "fullName": "System Administrator",
        "role": "ADMIN"
      },
      "timestamp": "2025-10-18T09:23:02.625Z",
      "ipAddress": "127.0.0.1",
      "userAgent": "Mozilla/5.0..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "pages": 2
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "message": "Invalid input data",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required",
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Authentication failed",
  "message": "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Client intake not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Something went wrong"
}
```

## Data Models

### ClientIntake
```typescript
interface ClientIntake {
  id: string;
  legalName: string;
  tradeName?: string;
  type: 'INDIVIDUAL' | 'PARTNERSHIP' | 'COMPANY' | 'NGO' | 'OTHER';
  ownerName: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phoneMobile: string;
  phoneLand?: string;
  email: string;
  website?: string;
  natureOfBusiness: string;
  industry?: string;
  clientPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'VIP';
  servicesSelected: string[];
  serviceFrequency?: string;
  tin?: string;
  taxTypesSelected: string[];
  otherRegistrations?: string;
  companySecretary?: string;
  registrationNumber?: string;
  incorporationDate?: string;
  annualRevenue?: number;
  employeeCount?: number;
  ramisStatus: 'AVAILABLE' | 'NOT_AVAILABLE';
  ramisEmail?: string;
  docsBusinessReg: boolean;
  docsDeed: boolean;
  docsVehicleReg: boolean;
  docsOther1?: string;
  docsOther2?: string;
  complianceNotes?: string;
  creditLimit?: number;
  paymentTerms?: string;
  preferredCurrency: string;
  notes?: string;
  consent: boolean;
  submittedAt: string;
  createdBy: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: string;
  relatedParties: RelatedParty[];
}
```

### RelatedParty
```typescript
interface RelatedParty {
  id: string;
  name: string;
  relationship: string;
  tin?: string;
  email?: string;
  phone?: string;
}
```

### User
```typescript
interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### AuditLog
```typescript
interface AuditLog {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT';
  entityType: string;
  entityId: string;
  userId: string;
  oldValues?: any;
  newValues?: any;
  clientIntakeId?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  user: User;
}
```
