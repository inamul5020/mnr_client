# MNR Client Intake System v1.8.1

A comprehensive client intake management system for MNR Associates, built with React, Node.js, and PostgreSQL. This system allows staff to collect detailed client information through a structured form and manage client data through an admin dashboard.

## 🎉 **STABLE VERSION - v1.8.1**

**✅ FULLY WORKING & PRODUCTION READY**

This is the stable, production-ready version that has been tested and verified to work in production.

### **Quick Status**
- ✅ **Frontend**: Working (https://mnrlk.com)
- ✅ **Backend**: Working (https://api.mnrlk.com) 
- ✅ **Database**: Connected and operational
- ✅ **Authentication**: JWT-based auth working
- ✅ **Form Submission**: Complete client intake working
- ✅ **Admin Dashboard**: View, edit, delete, export working
- ✅ **Export**: Comprehensive Excel and CSV export working
- ✅ **Print Functionality**: Dynamic A4-optimized client reports
- ✅ **Statistics Dashboard**: Real-time analytics and metrics
- ✅ **Tax Year Tracking**: Complete tax return submission tracking
- ✅ **Dynamic Print Layout**: Smart compact/standard/detailed modes
- ✅ **Comprehensive Export**: 60+ columns with all client details

### **Multi-Environment Setup**
- **Development**: Localhost configuration (ports 3003, 3001, 5433)
- **Production**: Production URLs (https://mnrlk.com, https://api.mnrlk.com)
- **Scripts**: Automated environment switching scripts
- **Documentation**: Complete multi-environment deployment guide

## 🚀 Features

## 🆕 **Recent Enhancements (v1.8.0)**

### Form Structure Updates
- **Section A Enhancements**: Added "Managed By" dropdown with Owner/Other options and conditional contact name fields
- **Validation Changes**: Made Phone Mobile, Email, Nature of Business, and TIN optional (removed red asterisks)
- **Section B Updates**: Removed frequency selections from all tax services for simplified workflow
- **Section F Removal**: Completely removed Financial Terms section from form and database

### Data Model Changes
- Added `managedBy` and `managedByContactName` fields to client records
- Removed `creditLimit`, `paymentTerms`, and `preferredCurrency` fields
- Updated all exports (Excel/CSV) to include new fields and exclude removed fields
- Enhanced print view and client detail view with new field displays

### User Experience Improvements
- Streamlined form submission process with fewer required fields
- Simplified service selection without frequency complexity
- Cleaner form layout with conditional field display
- Updated all display components to reflect new data structure

## 🆕 **Recent Enhancements (v1.7.0)**

### Dynamic Print Layout
- **Smart Content Detection**: Automatically analyzes client data density
- **Three Print Modes**: 
  - **Compact Mode (1 page)**: Ultra-compressed layout for minimal data
  - **Standard Mode (2 pages)**: Balanced layout for moderate data
  - **Detailed Mode (3+ pages)**: Full layout for comprehensive data
- **Dynamic Adjustments**: Font sizes, spacing, and grid layouts adapt to content
- **Page Optimization**: Prevents awkward page breaks and reduces whitespace

### Comprehensive Export System
- **60+ Columns**: Complete client information in every export
- **Tax Return Years**: Human-readable format showing all tax categories and submitted years
- **Related Parties**: Up to 4 related parties with complete contact details
- **Financial Terms**: Credit limits, payment terms, preferred currency
- **Document Status**: All document types with Yes/No indicators
- **Audit Information**: Created by, submission timestamp, consent status
- **Smart Formatting**: Proper handling of dates, booleans, and arrays

### Enhanced Data Management
- **Complete Client Profiles**: Every field from the intake form included in exports
- **Tax Compliance Tracking**: Comprehensive tax return year tracking across all categories
- **Business Intelligence**: Rich data export for analysis and reporting
- **Integration Ready**: Structured data format for external system integration

### Client Intake Form
- **5-Section Comprehensive Form** with validation (merged Sections B & C)
- **Hierarchical Service Selection** with subcategories and frequencies
- **Tax Year Tracking** for all tax services (2010-2025)
- **Income Tax Types** (CIT, PIT, IIT) with individual year tracking
- **Fill Sample Data Buttons** for easy testing
- **Real-time Validation** with error handling
- **Responsive Design** for all devices
- **Authentication Required** for form submission

### Admin Dashboard
- **Client Management** - View, search, and filter clients
- **Statistics Dashboard** - Real-time analytics and metrics
- **Detailed View** - Complete client information modal
- **Edit Functionality** - Update client information with full form validation
- **Dynamic Print Functionality** - Smart A4-optimized client reports with compact/standard/detailed modes
- **Delete Protection** - Passcode-protected deletion with soft delete
- **Comprehensive Export Functionality** - Excel and CSV export with 60+ columns including tax return years
- **User Authentication** - Role-based access control
- **Audit Logging** - Complete action tracking

### Security Features
- **JWT Authentication** - Secure token-based login
- **Passcode Protection** - Required for delete operations
- **User Tracking** - Every action logged with user details
- **Soft Delete** - Data preserved for audit purposes

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Axios** for API communication
- **Context API** for authentication state

### Backend (Node.js + Express)
- **Express.js** REST API
- **Prisma ORM** for database operations
- **PostgreSQL** database
- **JWT** for authentication
- **Express Validator** for input validation
- **ExcelJS** and **csv-writer** for exports

### Database (PostgreSQL)
- **Client Intake Records** with comprehensive fields
- **Related Parties** management
- **User Management** with roles
- **Audit Logging** for all actions

## 📋 Form Sections

### Section A - Organization Details
- Legal name, trade name, type
- Owner/primary contact information
- Business address and contact details
- Nature of business and industry
- Client priority level

### Section B - Services & Tax Profile (Merged)
- Service type selection (Direct Tax, Indirect Tax, Accounts, Audit, HR Services, SLTDA, Trade License)
- Direct Tax subcategories (Income Taxes with CIT/PIT/IIT, Capital Gain Tax)
- Indirect Tax subcategories (VAT, SSCL, APIT, WHT/AIT)
- Service frequency selection (Monthly, Quarterly, Annually)
- Tax return year tracking (2010-2025) for each subcategory
- TIN requirement and other registrations

### Section C - Secretarial & Related Parties
- Company secretary (for companies)
- Related parties (up to 4)
- Registration and incorporation details
- Financial information

### Section D - RAMIS & Documents
- RAMIS access status
- Document availability tracking
- Other document specifications

### Section E - Financial Terms
- Credit limits and payment terms
- Preferred currency
- Additional notes
- Consent and privacy notice

## 🔐 Authentication

### User Roles
- **ADMIN** - Full system access
- **MANAGER** - Management functions
- **STAFF** - Standard operations

### Test Accounts
- **Admin**: `admin` / `admin123`
- **Manager**: `manager` / `manager123`
- **Staff**: `staff1` / `staff123`
- **Staff**: `staff2` / `staff456`

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development)
- PostgreSQL (if running locally)

### Using Docker Compose (Recommended)

#### Development Environment
```bash
# Quick start (automated)
./start-dev.sh

# Or manual setup
docker-compose -f docker-compose.dev.yml up -d
```

#### Production Environment
```bash
# Quick start (automated)
./start-prod.sh

# Or manual setup
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

#### Default (Development)
```bash
# Uses docker-compose.yml (same as dev)
docker-compose up -d
```

### Local Development

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npx prisma db push
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📊 Database Schema

### ClientIntake Model
```prisma
model ClientIntake {
  id          String   @id @default(cuid())
  
  // Section A - Organization
  legalName   String
  tradeName   String?
  type        ClientType
  ownerName   String
  address     String
  // ... more fields
  
  // Relations
  relatedParties  RelatedParty[]
  auditLogs       AuditLog[]
}
```

### User Model
```prisma
model User {
  id          String   @id @default(cuid())
  username    String   @unique
  password    String
  fullName    String
  role        UserRole
  // ... more fields
}
```

### AuditLog Model
```prisma
model AuditLog {
  id          String   @id @default(cuid())
  action      AuditAction
  entityType  String
  entityId    String
  userId      String
  // ... more fields
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/users` - List users

### Client Intake
- `POST /api/intake` - Submit client intake (requires auth)
- `GET /api/intake` - List client intakes with filtering
- `GET /api/intake/:id` - Get specific client intake
- `PUT /api/intake/:id` - Update client intake (requires auth)
- `DELETE /api/intake/:id` - Delete client intake (requires auth + passcode)

### Export
- `GET /api/export/excel/:id` - Export single client to Excel with comprehensive details
- `GET /api/export/excel-all` - Export all clients to Excel with 60+ columns including tax return years
- `GET /api/export/csv/:id` - Export single client to CSV with comprehensive details
- `GET /api/export/csv-all` - Export all clients to CSV with 60+ columns including tax return years

### Audit
- `GET /api/audit/logs` - Get audit logs (requires auth)

## 🛠️ Development

### Project Structure
```
mnr_client/
├── backend/
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth and validation
│   │   └── index.ts         # Main server file
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Database seeding
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── lib/            # API client and utilities
│   │   └── types/          # TypeScript types
│   └── package.json
├── docker-compose.yml
└── README.md
```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/mnr_client"
JWT_SECRET="your-secret-key"
PORT=3001
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

### Database Operations

#### Reset Database
```bash
npx prisma db push --force-reset
```

#### Seed Database
```bash
npm run db:seed
```

#### View Database
```bash
npx prisma studio
```

## 🚀 Production Deployment

### Multi-Environment Setup
The project supports separate configurations for development and production:

- **Development**: `docker-compose.dev.yml` - Ports 3003, 3001, 5433
- **Production**: `docker-compose.prod.yml` - Ports 80, 3001, 5432
- **Default**: `docker-compose.yml` - Same as development

### Quick Production Deployment
```bash
# Automated deployment
./start-prod.sh

# Or manual deployment
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### Production URLs
- **Frontend**: https://mnrlk.com
- **Backend API**: https://api.mnrlk.com
- **Health Check**: https://api.mnrlk.com/health

### Environment Configuration
The application automatically detects the environment:
- **Development**: Uses localhost URLs
- **Production**: Uses mnrlk.com URLs
- **Smart Detection**: Based on hostname and environment variables

### Docker Compose (Production)
The application is containerized and ready for deployment with Docker Compose.

### Coolify Environment Variables (Working Example)
When deploying via Coolify, configure the following environment variables for a successful production run (as validated in production):

```
SERVICE_FQDN_BACKEND=api.mnrlk.com
SERVICE_FQDN_FRONTEND=client.mnrlk.com
SERVICE_URL_BACKEND=https://api.mnrlk.com
SERVICE_URL_FRONTEND=https://client.mnrlk.com
VITE_API_URL=https://api.mnrlk.com

# Backend runtime
CORS_ORIGIN=https://client.mnrlk.com
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
PORT=3001

# Postgres (internal service)
POSTGRES_DB=mnr_client_intake
POSTGRES_USER=mnr_user
POSTGRES_PASSWORD=mnr_password
```

Notes:
- Coolify handles networking; do not publish host ports in Compose, use `expose` and Coolify labels.
- Ensure DNS for `client.mnrlk.com` and `api.mnrlk.com` points to your Coolify server IP.

## 📝 Usage Guide

### For Staff Users

1. **Login to the system**
   - Go to the application URL
   - Enter your credentials
   - Access the client intake form

2. **Submit Client Intake**
   - Fill out all required sections
   - Use "Fill Sample Data" buttons for testing
   - Submit the form (requires authentication)

3. **Access Admin Dashboard**
   - Navigate to the admin section
   - View all client submissions
   - Use search and filter options
   - Export data as needed

### For Administrators

1. **User Management**
   - View all users and their roles
   - Monitor system activity

2. **Data Management**
   - View detailed client information
   - Export data in Excel/CSV format
   - Delete records (requires passcode)

3. **Audit Trail**
   - Monitor all system activities
   - Track user actions
   - Review data changes

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Session management
- Password protection

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### Audit & Compliance
- Complete audit logging
- User action tracking
- Data change history
- Soft delete functionality

## 🐛 Troubleshooting

### Common Issues

1. **Login Issues**
   - Verify credentials are correct
   - Check if JWT token is valid
   - Clear browser cache and localStorage

2. **Database Connection**
   - Ensure PostgreSQL is running
   - Check database URL configuration
   - Verify database exists

3. **Form Submission Errors**
   - Check all required fields are filled
   - Verify authentication is active
   - Check network connectivity

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in the backend environment.

## 📈 Performance

### Optimization Features
- Database indexing for fast queries
- Pagination for large datasets
- Efficient data loading
- Optimized Docker images

### Monitoring
- Request logging
- Error tracking
- Performance metrics
- Database query optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software for MNR Associates.

## 📞 Support

For technical support or questions, please contact the development team.

---

**MNR Associates Client Intake System** - Streamlining client onboarding and management.