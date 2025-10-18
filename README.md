# MNR Client Intake System

A comprehensive client intake management system for MNR Associates, built with React, Node.js, and PostgreSQL. This system allows staff to collect detailed client information through a structured form and manage client data through an admin dashboard.

## 🚀 Features

### Client Intake Form
- **6-Section Comprehensive Form** with validation
- **Fill Sample Data Buttons** for easy testing
- **Real-time Validation** with error handling
- **Responsive Design** for all devices
- **Authentication Required** for form submission

### Admin Dashboard
- **Client Management** - View, search, and filter clients
- **Detailed View** - Complete client information modal
- **Export Functionality** - Excel and CSV export options
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

### Section B - Services Needed
- Service type selection (multi-select)
- Service frequency
- TIN requirement (conditional)
- Tax services (Direct/Indirect)

### Section C - Tax Profile
- Registered tax types
- Other registrations and notes
- Compliance information

### Section D - Secretarial & Related Parties
- Company secretary (for companies)
- Related parties (up to 4)
- Registration and incorporation details
- Financial information

### Section E - RAMIS & Documents
- RAMIS access status
- Document availability tracking
- Other document specifications

### Section F - Financial Terms
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

1. **Clone the repository**
   ```bash
   git clone https://github.com/inamul5020/mnr_client.git
   cd mnr_client
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

4. **Login and start using**
   - Go to http://localhost:3000
   - Login with any test account
   - Submit forms or access admin dashboard

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
- `GET /api/intake` - List client intakes
- `GET /api/intake/:id` - Get specific client intake
- `DELETE /api/intake/:id` - Delete client intake (requires auth + passcode)

### Export
- `GET /api/export/excel/:id` - Export single client to Excel
- `GET /api/export/excel/all` - Export all clients to Excel
- `GET /api/export/csv/:id` - Export single client to CSV
- `GET /api/export/csv/all` - Export all clients to CSV

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

## 🚀 Deployment

### Docker Compose (Production)
The application is containerized and ready for deployment with Docker Compose.

### Coolify Deployment
The system is designed to be deployed on Coolify with the provided `docker-compose.yml`.

### Environment Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy using Docker Compose
4. Access the application

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