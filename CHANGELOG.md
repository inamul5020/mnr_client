# Changelog

All notable changes to the MNR Client Intake System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.1] - 2025-01-22

### Fixed
- **Improved Form Logic**: Fixed "Managed By" field logic where "Other Contact Name" field only appears when "Other" is selected
- **Better Field Ordering**: Moved "Managed By" field to appear after "Owner/Primary Contact Name" for better logical flow
- **Conditional Display**: "Other Contact Name" field now only shows when "Other" is selected in "Managed By" dropdown
- **Export Updates**: Updated all export formats (Excel, CSV) to reflect improved field ordering and conditional logic
- **Display Components**: Updated PrintView and ClientDetailView to show fields in logical order with proper conditional display

### Technical Improvements
- **Form UX**: Eliminated redundancy by not asking for owner name again when "Owner" is selected
- **Data Consistency**: Ensured all views and exports display the same logical field structure
- **Code Quality**: Improved conditional rendering logic across all components

## [1.8.0] - 2025-01-22

### Added
- **Managed By Field**: Added dropdown with "Owner" and "Other" options in Section A
- **Conditional Contact Fields**: Added "Managed By Contact Name" field that displays based on Managed By selection
- **Enhanced Data Model**: Added `managedBy` and `managedByContactName` fields to database schema

### Changed
- **Validation Updates**: Made Phone Mobile, Email, Nature of Business, and TIN optional (removed required validation)
- **Service Frequency Removal**: Removed frequency selection from all tax services (Income Taxes, Capital Gain Tax, VAT, SSCL, APIT, WHT/AIT)
- **Service Frequency Removal**: Removed frequency selection from HR Services, SLTDA, Trade License, Audit, Accounts
- **Form Structure**: Simplified Section B by removing frequency complexity
- **Export Updates**: Updated Excel and CSV exports to include new fields and exclude removed fields

### Removed
- **Section F Complete Removal**: Removed Financial Terms section entirely from form and database
- **Financial Fields**: Removed `creditLimit`, `paymentTerms`, and `preferredCurrency` from data model
- **Required Validations**: Removed red asterisks from Phone Mobile, Email, Nature of Business, and TIN fields

### Updated
- **Display Components**: Updated PrintView and ClientDetailView to show new fields and hide removed sections
- **TypeScript Types**: Updated interface definitions to reflect new optional fields
- **Backend API**: Updated validation middleware and data handling for new field structure
- **Form Components**: Updated Section A and Section B components with new field structure

### Technical Improvements
- **Database Schema**: Updated Prisma schema with new fields and removed deprecated fields
- **Form Validation**: Simplified validation rules for better user experience
- **Export Functionality**: Enhanced export files with comprehensive field mapping
- **Component Architecture**: Improved conditional rendering for new field structure

## [1.7.0] - 2025-10-22

### Added
- **Dynamic Print Layout System** - Smart content detection and adaptive print modes
- **Comprehensive Export Enhancement** - 60+ columns with complete client details
- **Tax Return Years Export** - Human-readable tax return year tracking in exports
- **Smart Print Modes**:
  - **Compact Mode (1 page)**: Ultra-compressed layout for minimal data
  - **Standard Mode (2 pages)**: Balanced layout for moderate data  
  - **Detailed Mode (3+ pages)**: Full layout for comprehensive data
- **Enhanced Export Columns**:
  - Complete organization details (address, city, state, ZIP, country)
  - Full contact information (mobile, landline, email, website)
  - Business information (nature, industry, priority)
  - Service details (selected services, frequencies, tax types)
  - Tax return years with formatted display
  - Company details (secretary, registration, incorporation, revenue, employees)
  - RAMIS and document status
  - Financial terms (credit limit, payment terms, currency)
  - Related parties (up to 4 with complete contact details)
  - Audit information (created by, submission date, consent)

### Enhanced
- **Print View Component** - Dynamic layout adjustment based on content density
- **Export API Endpoints** - Comprehensive data export for both Excel and CSV
- **Data Formatting** - Smart formatting for dates, booleans, and arrays
- **Tax Return Years Display** - Human-readable format: "Income Tax: 2020, 2021, 2022 | VAT: 2021, 2022"
- **Export File Naming** - Updated to include "comprehensive" for clarity

### Technical Improvements
- **Helper Functions** - Added `formatTaxReturnYears()` for readable tax data
- **Null Safety** - Enhanced null checks for arrays and optional fields
- **Export Performance** - Optimized data processing for large exports
- **Column Width Management** - Smart column sizing for Excel exports
- **Data Validation** - Enhanced validation for export data integrity

### Fixed
- **Export Array Handling** - Fixed "Cannot read properties of undefined (reading 'join')" errors
- **Tax Return Years Processing** - Proper handling of JSON tax return years data
- **Export Data Completeness** - Ensured all client fields are included in exports

## [1.0.1] - 2025-10-18

### Fixed
- **Form Submission** - Fixed form submission issues in frontend
- **Delete Functionality** - Fixed 400 error on delete operations by properly sending passcode in request body
- **API Client** - Updated delete function to require passcode parameter
- **CRUD Operations** - All CRUD operations now working correctly

### Added
- **Edit Functionality** - Added edit button and update capability for client records
- **PUT API Endpoint** - New PUT /api/intake/:id endpoint for updating client intakes
- **Delete Confirmation Modal** - Passcode-protected delete confirmation dialog
- **Edit Form Modal** - Modal for editing client information (basic implementation)
- **Enhanced Error Handling** - Better error messages and validation

### Updated
- **Admin Dashboard** - Added edit and improved delete functionality
- **API Documentation** - Updated to include PUT endpoint and fixed delete documentation
- **Frontend API Client** - Enhanced with update and improved delete functions

## [1.0.0] - 2025-10-18

### Added
- **Initial Release** of MNR Client Intake System
- **Complete Client Intake Form** with 6 comprehensive sections
- **JWT-based Authentication** system with role-based access control
- **Admin Dashboard** with client management capabilities
- **PostgreSQL Database** with Prisma ORM
- **Excel and CSV Export** functionality
- **Audit Logging** for all user actions
- **Docker Containerization** for easy deployment
- **Responsive Design** with Tailwind CSS
- **TypeScript** for type safety across the stack

### Features

#### Client Intake Form
- **Section A - Organization Details**: Legal name, type, contact information, business details
- **Section B - Services Needed**: Service selection, frequency, TIN requirements
- **Section C - Tax Profile**: Tax registrations and compliance information
- **Section D - Secretarial & Related Parties**: Company details and related parties management
- **Section E - RAMIS & Documents**: RAMIS access and document tracking
- **Section F - Financial Terms**: Credit limits, payment terms, and additional notes
- **Fill Sample Data Buttons**: Easy testing with pre-populated data
- **Real-time Validation**: Client-side and server-side validation
- **Multi-step Navigation**: Intuitive form progression

#### Authentication & Security
- **JWT Authentication**: Secure token-based login system
- **Role-based Access Control**: Admin, Manager, and Staff roles
- **Password Protection**: Secure password handling
- **Session Management**: Automatic token refresh and logout
- **Audit Trail**: Complete logging of all user actions
- **Soft Delete**: Data preservation for audit purposes

#### Admin Dashboard
- **Client Management**: View, search, and filter client records
- **Detailed Client View**: Comprehensive client information modal
- **Export Functionality**: Excel and CSV export options
- **User Management**: User role and permission management
- **Audit Logs**: Complete action tracking and reporting

#### Database & Backend
- **PostgreSQL Database**: Robust data storage with ACID compliance
- **Prisma ORM**: Type-safe database operations
- **RESTful API**: Clean and consistent API design
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Graceful error management
- **Rate Limiting**: API protection against abuse

#### Frontend & UI
- **React 19**: Latest React features and performance
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern and responsive styling
- **React Hook Form**: Efficient form management
- **Context API**: Global state management
- **Responsive Design**: Mobile-first approach

#### Deployment & Infrastructure
- **Docker Compose**: Easy local development and deployment
- **Multi-stage Builds**: Optimized Docker images
- **Nginx Configuration**: Production-ready web server setup
- **Environment Configuration**: Flexible environment management
- **Health Checks**: Application monitoring
- **Coolify Ready**: Cloud deployment configuration

### Technical Specifications

#### Backend Stack
- Node.js 20+ with Express.js
- TypeScript for type safety
- Prisma ORM with PostgreSQL
- JWT authentication
- Express Validator for validation
- ExcelJS and csv-writer for exports
- Helmet for security
- Morgan for logging
- CORS for cross-origin requests

#### Frontend Stack
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Hook Form for forms
- Axios for HTTP requests
- Lucide React for icons
- React Router for navigation

#### Database Schema
- **ClientIntake**: Main client data model
- **User**: User management and authentication
- **RelatedParty**: Associated parties management
- **AuditLog**: Complete audit trail
- **Enums**: Type-safe enumerations

#### API Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/auth/users` - User management
- `POST /api/intake` - Client intake submission
- `GET /api/intake` - Client list with filtering
- `GET /api/intake/:id` - Individual client details
- `DELETE /api/intake/:id` - Client deletion
- `GET /api/export/*` - Data export endpoints
- `GET /api/audit/logs` - Audit log access

### Security Features
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Security headers
- Audit logging
- Soft delete functionality

### Performance Features
- Database indexing for fast queries
- Pagination for large datasets
- Optimized Docker images
- Code splitting and lazy loading
- Response compression
- Caching strategies
- Memory optimization

### Documentation
- **README.md**: Complete project overview and setup
- **API.md**: Comprehensive API documentation
- **DEPLOYMENT.md**: Deployment and infrastructure guide
- **USER_GUIDE.md**: End-user documentation
- **TECHNICAL.md**: Technical architecture and implementation
- **CHANGELOG.md**: Version history and changes

### Test Accounts
- **Admin**: `admin` / `admin123`
- **Manager**: `manager` / `manager123`
- **Staff**: `staff1` / `staff123`
- **Staff**: `staff2` / `staff456`

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### System Requirements
- Docker and Docker Compose
- Node.js 20+ (for local development)
- PostgreSQL 15+ (if running locally)
- Modern web browser with JavaScript enabled

### Known Issues
- None at initial release

### Future Enhancements
- Advanced reporting and analytics
- Email notifications
- File upload functionality
- Advanced search and filtering
- Mobile application
- API rate limiting improvements
- Advanced audit reporting
- Data visualization dashboard

---

## Development Notes

### Version Numbering
- **Major Version**: Breaking changes or major feature additions
- **Minor Version**: New features or significant improvements
- **Patch Version**: Bug fixes and minor improvements

### Release Process
1. Update version numbers
2. Update CHANGELOG.md
3. Create release tag
4. Deploy to production
5. Update documentation

### Contributing
- Follow the established code style
- Write comprehensive tests
- Update documentation
- Follow semantic versioning
- Create detailed pull requests

---

**MNR Client Intake System v1.0.0** - Streamlining client onboarding and management for MNR Associates.
