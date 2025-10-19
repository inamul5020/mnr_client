# MNR Client Intake System - API Documentation

## 🚀 **API Base URL**
```
https://api.mnrlk.com/api
```

## 🔐 **Authentication**

All API endpoints (except health check) require JWT authentication.

### **Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "ADMIN",
    "fullName": "System Administrator"
  }
}
```

### **Authorization Header**
```http
Authorization: Bearer <jwt_token>
```

## 📊 **Health Check**

### **Get System Health**
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-19T12:00:00.000Z",
  "database": "Connected"
}
```

## 👥 **User Management**

### **Get Current User**
```http
GET /api/users/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "role": "ADMIN",
  "fullName": "System Administrator",
  "createdAt": "2025-01-19T12:00:00.000Z"
}
```

## 📋 **Client Intake Management**

### **Submit Client Intake**
```http
POST /api/intake
Authorization: Bearer <token>
Content-Type: application/json

{
  "legalName": "Sample Company Ltd",
  "tradeName": "Sample Co",
  "type": "COMPANY",
  "ownerName": "John Smith",
  "address": "123 Business Street, Colombo 03",
  "phoneMobile": "+94771234567",
  "phoneLandline": "+94112345678",
  "email": "john@sample.com",
  "natureOfBusiness": "Software Development",
  "servicesSelected": ["DIRECT_TAX", "INDIRECT_TAX"],
  "frequency": "MONTHLY",
  "tin": "123456789",
  "taxTypesSelected": ["INCOME_TAX", "VAT"],
  "companySecretary": "Jane Secretary",
  "relatedParties": [
    {
      "name": "Related Company Ltd",
      "relationship": "SUBSIDIARY",
      "tin": "987654321"
    }
  ],
  "ramisStatus": "AVAILABLE",
  "ramisEmail": "ramis@sample.com",
  "documentsProvided": {
    "businessRegistration": true,
    "deedCopy": true,
    "vehicleRegistration": false,
    "other1": "Tax Certificate",
    "other2": "Bank Statements"
  },
  "notes": "Additional notes here",
  "consent": true
}
```

**Response:**
```json
{
  "id": 1,
  "legalName": "Sample Company Ltd",
  "status": "SUBMITTED",
  "submittedAt": "2025-01-19T12:00:00.000Z"
}
```

### **Get All Client Intakes**
```http
GET /api/intake
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term
- `status` (optional): Filter by status

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "legalName": "Sample Company Ltd",
      "tradeName": "Sample Co",
      "type": "COMPANY",
      "ownerName": "John Smith",
      "email": "john@sample.com",
      "status": "SUBMITTED",
      "submittedAt": "2025-01-19T12:00:00.000Z",
      "submittedBy": "admin"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### **Get Client Intake by ID**
```http
GET /api/intake/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "legalName": "Sample Company Ltd",
  "tradeName": "Sample Co",
  "type": "COMPANY",
  "ownerName": "John Smith",
  "address": "123 Business Street, Colombo 03",
  "phoneMobile": "+94771234567",
  "phoneLandline": "+94112345678",
  "email": "john@sample.com",
  "natureOfBusiness": "Software Development",
  "servicesSelected": ["DIRECT_TAX", "INDIRECT_TAX"],
  "frequency": "MONTHLY",
  "tin": "123456789",
  "taxTypesSelected": ["INCOME_TAX", "VAT"],
  "companySecretary": "Jane Secretary",
  "relatedParties": [
    {
      "name": "Related Company Ltd",
      "relationship": "SUBSIDIARY",
      "tin": "987654321"
    }
  ],
  "ramisStatus": "AVAILABLE",
  "ramisEmail": "ramis@sample.com",
  "documentsProvided": {
    "businessRegistration": true,
    "deedCopy": true,
    "vehicleRegistration": false,
    "other1": "Tax Certificate",
    "other2": "Bank Statements"
  },
  "notes": "Additional notes here",
  "consent": true,
  "status": "SUBMITTED",
  "submittedAt": "2025-01-19T12:00:00.000Z",
  "submittedBy": "admin",
  "createdAt": "2025-01-19T12:00:00.000Z",
  "updatedAt": "2025-01-19T12:00:00.000Z"
}
```

### **Update Client Intake**
```http
PUT /api/intake/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "legalName": "Updated Company Ltd",
  "tradeName": "Updated Co",
  // ... other fields
}
```

**Response:**
```json
{
  "id": 1,
  "legalName": "Updated Company Ltd",
  "status": "UPDATED",
  "updatedAt": "2025-01-19T12:00:00.000Z"
}
```

### **Delete Client Intake**
```http
DELETE /api/intake/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "passcode": "DELETE123"
}
```

**Response:**
```json
{
  "message": "Client intake deleted successfully",
  "id": 1
}
```

## 📊 **Export Functions**

### **Export to Excel**
```http
GET /api/export/excel/:id
Authorization: Bearer <token>
```

**Response:** Excel file download

### **Export All to Excel**
```http
GET /api/export/excel
Authorization: Bearer <token>
```

**Response:** Excel file with all client intakes

### **Export to CSV**
```http
GET /api/export/csv/:id
Authorization: Bearer <token>
```

**Response:** CSV file download

### **Export All to CSV**
```http
GET /api/export/csv
Authorization: Bearer <token>
```

**Response:** CSV file with all client intakes

## 🔍 **Data Models**

### **Client Intake**
```typescript
interface ClientIntake {
  id: number;
  legalName: string;
  tradeName?: string;
  type: 'COMPANY' | 'PARTNERSHIP' | 'INDIVIDUAL' | 'NGO' | 'OTHER';
  ownerName: string;
  address: string;
  phoneMobile: string;
  phoneLandline?: string;
  email: string;
  natureOfBusiness: string;
  servicesSelected: string[];
  frequency?: 'MONTHLY' | 'ANNUAL';
  tin?: string;
  taxTypesSelected?: string[];
  companySecretary?: string;
  relatedParties?: RelatedParty[];
  ramisStatus: 'AVAILABLE' | 'NOT_AVAILABLE';
  ramisEmail?: string;
  documentsProvided: DocumentsProvided;
  notes?: string;
  consent: boolean;
  status: 'SUBMITTED' | 'UPDATED' | 'DELETED';
  submittedAt: Date;
  submittedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### **Related Party**
```typescript
interface RelatedParty {
  name: string;
  relationship: 'DIRECTOR' | 'PARTNER' | 'OWNER' | 'SUBSIDIARY' | 'ASSOCIATE' | 'OTHER';
  tin?: string;
}
```

### **Documents Provided**
```typescript
interface DocumentsProvided {
  businessRegistration: boolean;
  deedCopy: boolean;
  vehicleRegistration: boolean;
  other1?: string;
  other2?: string;
}
```

## 🚨 **Error Responses**

### **400 Bad Request**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### **401 Unauthorized**
```json
{
  "error": "Authentication required",
  "message": "Please provide a valid JWT token"
}
```

### **403 Forbidden**
```json
{
  "error": "Insufficient permissions",
  "message": "You don't have permission to perform this action"
}
```

### **404 Not Found**
```json
{
  "error": "Resource not found",
  "message": "Client intake with ID 123 not found"
}
```

### **500 Internal Server Error**
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## 🔧 **Rate Limiting**

- **Rate Limit**: 100 requests per 15 minutes per IP
- **Headers**: 
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: 95
  - `X-RateLimit-Reset`: 1640995200

## 📝 **Request/Response Examples**

### **Complete Client Intake Submission**
```bash
curl -X POST https://api.mnrlk.com/api/intake \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "legalName": "Test Company Ltd",
    "type": "COMPANY",
    "ownerName": "Test Owner",
    "address": "123 Test Street",
    "phoneMobile": "+94771234567",
    "email": "test@company.com",
    "natureOfBusiness": "Testing",
    "servicesSelected": ["DIRECT_TAX"],
    "tin": "123456789",
    "companySecretary": "Test Secretary",
    "ramisStatus": "AVAILABLE",
    "documentsProvided": {
      "businessRegistration": true,
      "deedCopy": true
    },
    "consent": true
  }'
```

### **Get All Client Intakes with Pagination**
```bash
curl -X GET "https://api.mnrlk.com/api/intake?page=1&limit=10&search=company" \
  -H "Authorization: Bearer <token>"
```

---

**This API documentation covers all endpoints and data structures for the MNR Client Intake System.** 🎉
