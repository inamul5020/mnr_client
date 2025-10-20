# MNR Client Intake System - Stable Version v1.5.0

## 🎉 **STABLE & WORKING VERSION**

This is the fully working, stable version of the MNR Client Intake System that has been tested and verified to work in production.

## ✅ **What's Working**

### **Frontend (client.mnrlk.com)**
- ✅ **User Authentication** - Login/logout with JWT tokens
- ✅ **Client Intake Form** - Complete 6-section form with validation
- ✅ **Admin Dashboard** - View, edit, delete, export client data
- ✅ **API Connectivity** - Proper connection to backend API
- ✅ **TIN Field Validation** - Conditional validation for tax services
- ✅ **Health Check Indicator** - Shows API connection status
- ✅ **Export Functionality** - Excel and CSV export options

### **Backend (api.mnrlk.com)**
- ✅ **Authentication API** - JWT-based user authentication
- ✅ **Client Intake API** - CRUD operations for client data
- ✅ **Export API** - Excel and CSV generation
- ✅ **Database Integration** - PostgreSQL with Prisma ORM
- ✅ **CORS Configuration** - Proper cross-origin setup
- ✅ **Health Check** - `/health` endpoint for monitoring

### **Database**
- ✅ **PostgreSQL** - Reliable data storage
- ✅ **Prisma ORM** - Type-safe database operations
- ✅ **Audit Logging** - Complete action tracking
- ✅ **User Management** - Admin, Manager, Staff roles

## 🚀 **Deployment Configuration**

### **Recommended Docker Compose**
Use: `docker-compose.coolify-v128.yml`

### **Services**
1. **PostgreSQL** - Database service
2. **Backend** - API service (Node.js + Express)
3. **Frontend** - Web interface (React + Vite)

### **Ports**
- Frontend: `80` (HTTP)
- Backend: `3001` (API)
- Database: `5432` (PostgreSQL)

## 🔧 **Environment Variables**

### **Required Variables**
```bash
# Database
POSTGRES_DB=mnr_client_intake
POSTGRES_USER=mnr_user
POSTGRES_PASSWORD=mnr_password

# Backend
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://client.mnrlk.com
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend
VITE_API_URL=https://api.mnrlk.com
```

## 👥 **Default Users**

| Username | Password | Role | Full Name |
|----------|----------|------|-----------|
| admin | admin123 | ADMIN | System Administrator |
| manager | manager123 | MANAGER | John Manager |
| staff1 | staff123 | STAFF | Sarah Staff |
| staff2 | staff123 | STAFF | Mike Staff |

## 📋 **Client Intake Form Sections**

### **Section A — Organization**
- Legal name (required)
- Business/trade name (optional)
- Type (Company/Partnership/Individual/NGO/Other)
- Owner/Primary contact name (required)
- Business address (required)
- Phone (mobile) (required)
- Phone (landline) (optional)
- Email (required)
- Nature of business (required)

### **Section B — Services Needed**
- Service type (multi-select, required)
- Frequency (Monthly/Annual)
- TIN (required if tax services selected)

### **Section C — Tax Profile**
- Registered tax types (multi-select, optional)
- Other registrations/notes (optional)

### **Section D — Secretarial & Related Parties**
- Company secretary (required if Company type)
- Related parties (up to 4, optional)

### **Section E — RAMIS & Documents**
- RAMIS access (Available/Not available)
- RAMIS email/username (optional)
- Documents provided (checkboxes)

### **Section F — Financial Terms**
- Credit limit (optional)
- Payment terms (optional)
- Preferred currency (optional)
- Additional notes (optional)
- Consent (required)

## 🔒 **Security Features**

- **JWT Authentication** - Secure token-based auth
- **Role-based Access** - Admin, Manager, Staff roles
- **Delete Protection** - Passcode required for deletions
- **Audit Logging** - Complete action tracking
- **Input Validation** - Server-side validation
- **CORS Protection** - Proper cross-origin setup

## 📊 **Export Features**

### **Excel Export**
- Single client export
- All clients export
- Formatted with proper columns

### **CSV Export**
- Single client export
- All clients export
- Comma-separated values

## 🛠️ **Technical Stack**

### **Frontend**
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Hook Form
- Axios
- Lucide React

### **Backend**
- Node.js 20
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- ExcelJS
- csv-writer

### **Database**
- PostgreSQL 16
- Prisma ORM
- Audit logging
- User management

## 📁 **File Structure**

```
mnr_client/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # API client
│   │   └── types/          # TypeScript types
│   ├── Dockerfile.simple-stable
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   └── index.ts        # Main server file
│   ├── prisma/             # Database schema
│   ├── Dockerfile.simple-working
│   └── package.json
├── docker-compose.coolify-v128.yml  # Main deployment
└── README.md
```

## 🚀 **Quick Start**

1. **Clone Repository**
   ```bash
   git clone https://github.com/inamul5020/mnr_client.git
   cd mnr_client
   ```

2. **Deploy to Coolify**
   - Use `docker-compose.coolify-v128.yml`
   - Set environment variables
   - Deploy all services

3. **Access Application**
   - Frontend: `https://client.mnrlk.com`
   - Backend API: `https://api.mnrlk.com`
   - Health Check: `https://api.mnrlk.com/health`

## 🔍 **Troubleshooting**

### **Common Issues**
1. **503 Service Unavailable** - Backend not starting
2. **CORS Errors** - Check CORS_ORIGIN setting
3. **Database Connection** - Check DATABASE_URL
4. **Authentication Failed** - Check JWT_SECRET

### **Health Checks**
- Frontend: `https://client.mnrlk.com`
- Backend: `https://api.mnrlk.com/health`
- Database: Check container logs

## 📝 **Changelog**

### **v1.5.0 - Stable Version**
- ✅ Complete working system
- ✅ All features tested and verified
- ✅ Comprehensive documentation
- ✅ Stable deployment configuration

### **Previous Versions**
- v1.4.1: v1.2.8 working approach
- v1.4.0: Manual database initialization
- v1.3.x: Database initialization fixes
- v1.2.x: API connectivity fixes
- v1.1.x: Initial development

## 🎯 **Success Metrics**

- ✅ **Frontend loads** without errors
- ✅ **Backend responds** to all API calls
- ✅ **Database connected** and operational
- ✅ **Authentication works** for all users
- ✅ **Form submission** saves data correctly
- ✅ **Export functionality** generates files
- ✅ **Admin dashboard** shows all data

## 📞 **Support**

For issues or questions:
1. Check the troubleshooting section
2. Review the logs in Coolify
3. Verify environment variables
4. Test individual services

---

**This is the stable, production-ready version of the MNR Client Intake System.** 🎉
