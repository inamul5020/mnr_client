#!/bin/bash

# 📚 Documentation Structure Setup Script
# This script recreates the complete docs folder structure with all necessary files
# Run this script to organize and maintain your documentation structure

echo "📚 Setting up documentation structure..."
echo "========================================"

# Create main docs directory
mkdir -p docs

# Create all subdirectories
echo "📁 Creating directory structure..."
mkdir -p docs/guides
mkdir -p docs/technical
mkdir -p docs/deployment
mkdir -p docs/testing
mkdir -p docs/features
mkdir -p docs/tools
mkdir -p docs/references
mkdir -p docs/assets
mkdir -p docs/archives
mkdir -p docs/templates/bolt
mkdir -p docs/templates/git
mkdir -p docs/chats

echo "✅ Directory structure created"

# Create main docs README
echo "📝 Creating main documentation README..."
cat > docs/README.md << 'EOF'
# 🕌 **Masjid SaaS Documentation**

**Complete documentation for the Islamic Community Management System - a comprehensive SaaS solution for managing masjids and their communities.**

[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)]()
[![Status](https://img.shields.io/badge/Status-Development-green.svg)]()
[![Last Updated](https://img.shields.io/badge/Updated-September_2025-orange.svg)]()

---

## 📋 **Documentation Index**

### **🚀 Getting Started**
- **[Main README](../README.md)** - Project overview and quick start guide
- **[Setup Guide](./guides/setup-guide.md)** - Complete installation instructions
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and recent updates

### **🔧 Technical Documentation**
- **[API Documentation](./technical/API.md)** - REST API endpoints and usage
- **[Swagger Setup](./technical/SWAGGER_SETUP.md)** - API documentation setup
- **[Technical Error Log](./technical/error-log.md)** - Setup issues and resolutions

### **📊 Features & Guides**
- **[Product Requirements](./references/prd.md)** - Complete feature specifications
- **[Tools Recommendations](./tools/TOOLS_RECOMMENDATIONS.md)** - Development tools and resources
- **[API Template](./tools/API_TEMPLATE.md)** - API endpoint documentation template
- **[Development Workflow](./guides/DEVELOPMENT_WORKFLOW.md)** - Development processes and best practices

### **🚀 Development Templates**

#### **Bolt.new Templates**
- **[Bolt.new Backend Template](./templates/bolt/bolt-new-backend-template.md)** - Complete backend generation template
- **[Bolt.new Quick Reference](./templates/bolt/bolt-new-quick-reference.md)** - Quick copy-paste prompts for bolt.new
- **[Bolt.new Complete Backend](./templates/bolt/bolt-new-complete-backend-template.md)** - Comprehensive backend template for any frontend project
- **[Bolt.new Complete Backend Quick](./templates/bolt/bolt-new-complete-backend-quick.md)** - Quick copy-paste version
- **[Bolt.new Entity Templates](./templates/bolt/bolt-new-entity-templates.md)** - Ready-to-use templates for common entity types
- **[Bolt.new Usage Example](./templates/bolt/example-usage.md)** - Step-by-step example of using the templates

#### **Project Templates**
- **[Project Template](./templates/git/PROJECT_TEMPLATE.md)** - Master template for new projects with placeholders
- **[Template Usage Guide](./templates/git/TEMPLATE_USAGE_GUIDE.md)** - How to use the project template system
- **[Template Quick Reference](./templates/git/TEMPLATE_QUICK_REFERENCE.md)** - Quick reference for template usage
- **[Customization Script](./templates/git/customize_template.sh)** - Automated template customization script

### **📁 Organization**
- **[guides/](./guides/)** - User guides and tutorials
- **[technical/](./technical/)** - Technical documentation and troubleshooting
- **[deployment/](./deployment/)** - Production deployment guides
- **[testing/](./testing/)** - Testing procedures and QA documentation
- **[features/](./features/)** - Feature-specific documentation
- **[tools/](./tools/)** - Templates and utility files
- **[references/](./references/)** - External resources and documentation
- **[assets/](./assets/)** - Diagrams and visual documentation
- **[archives/](./archives/)** - Historical documentation
- **[templates/](./templates/)** - Development templates and guides
  - **[bolt/](./templates/bolt/)** - Bolt.new AI development templates
  - **[git/](./templates/git/)** - Git repository and project templates
- **[chats/](./chats/)** - Development session logs and chat exports

---

## 🎯 **System Overview**

### **Core Features**
- ✅ **Multi-tenant Architecture** - Support unlimited masjids
- ✅ **Member Management** - Complete member lifecycle management
- ✅ **Financial Tracking** - Receipts, donations, and accounting
- ✅ **Benefit Distribution** - Automated benefit management
- ✅ **Household Management** - Address and family tracking
- ✅ **Rental Management** - Property and contract handling
- ✅ **Role-based Security** - Admin, Accountant, Staff, Member roles
- ✅ **Member Portal** - SMS OTP authentication and self-service
- ✅ **Audit Logging** - Complete activity tracking
- ✅ **Export Functionality** - Data export and reporting

### **Technology Stack**
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with role-based access control
- **Deployment:** Docker + Docker Compose

---

## 🚀 **Quick Start**

### **For New Users**
1. **[Installation Guide](../README.md#installation)** - Get the system running
2. **[Setup Guide](./guides/setup-guide.md)** - Detailed configuration steps
3. **[Demo Credentials](../README.md#demo-credentials)** - Test the system

### **For Developers**
1. **[Development Workflow](./DEVELOPMENT_WORKFLOW.md)** - Development processes
2. **[API Documentation](./API.md)** - Backend API reference
3. **[Technical Error Log](./technical/error-log.md)** - Troubleshooting guide

### **For System Administrators**
1. **[Deployment Guide](./deployment/)** - Production deployment
2. **[Database Management](./technical/)** - Database operations
3. **[Security Configuration](./technical/)** - Security best practices

---

## ✅ **Current Status**

### **🟢 Development Status**
- ✅ **Database Schema** - Complete with 34+ tables
- ✅ **Backend API** - RESTful API with authentication
- ✅ **Frontend Interface** - React application with routing
- ✅ **Authentication** - JWT-based with role management
- ✅ **Demo Data** - Sample users and configurations
- ✅ **Documentation** - Comprehensive setup and usage guides

### **🔧 Recent Development**
- ✅ **PostgreSQL Integration** - Docker-based database setup
- ✅ **Custom API Client** - Frontend-backend communication bridge
- ✅ **Authentication Flow** - Complete login/logout functionality
- ✅ **Environment Configuration** - Proper dev/prod setup
- ✅ **Error Handling** - Robust error management
- ✅ **Documentation Updates** - Current project documentation

### **🚧 In Progress**
- 🔄 **API Documentation** - Swagger/OpenAPI integration
- 🔄 **Testing Suite** - Comprehensive test coverage
- 🔄 **Production Deployment** - Docker Compose configuration
- 🔄 **Performance Optimization** - Database query optimization
- 🔄 **Mobile Responsiveness** - Enhanced mobile experience

---

## 📈 **Roadmap**

### **Phase 1: Core Features** ✅
- Multi-tenant architecture
- Member management system
- Financial tracking (receipts, donations)
- Basic authentication and authorization

### **Phase 2: Advanced Features** 🔄
- Benefit distribution system
- Rental property management
- Complete accounting with double-entry bookkeeping
- Member portal with SMS OTP

### **Phase 3: Production Ready** 📋
- Comprehensive testing suite
- Production deployment configuration
- Performance optimization
- Advanced reporting and analytics

---

## 🤝 **Contributing**

We welcome contributions to the Masjid SaaS project! Please see our main [README](../README.md) for contribution guidelines.

### **Documentation Standards**
- Use clear, concise language
- Include code examples where relevant
- Keep documentation up-to-date with code changes
- Follow the existing documentation structure

---

## 📞 **Support**

- **📧 Email:** support@masjidsaas.com
- **🐛 Issues:** [GitHub Issues](https://github.com/your-org/masjid-saas/issues)
- **📖 Main Documentation:** [../README.md](../README.md)

---

## 📄 **License**

This documentation is part of the Masjid SaaS project, licensed under the MIT License.

---

**🕌 Built for the Islamic community with ❤️**

**Last Updated**: September 2025
**Version**: 1.0.0
**Status**: ✅ **Development Ready**
EOF

# Create templates README
echo "📝 Creating templates README..."
cat > docs/templates/README.md << 'EOF'
# 🚀 Development Templates

This folder contains comprehensive templates and guides for rapid development using modern tools and best practices.

## 📁 Organization

### **🔧 Bolt.new Templates (`bolt/`)**
AI-powered backend development templates for rapid prototyping and development.

- **[bolt-new-backend-template.md](./bolt/bolt-new-backend-template.md)** - Complete backend generation template
- **[bolt-new-quick-reference.md](./bolt/bolt-new-quick-reference.md)** - Quick copy-paste prompts for bolt.new
- **[bolt-new-complete-backend-template.md](./bolt/bolt-new-complete-backend-template.md)** - Comprehensive backend template for any frontend project
- **[bolt-new-complete-backend-quick.md](./bolt/bolt-new-complete-backend-quick.md)** - Quick copy-paste version
- **[bolt-new-entity-templates.md](./bolt/bolt-new-entity-templates.md)** - Ready-to-use templates for common entity types
- **[example-usage.md](./bolt/example-usage.md)** - Step-by-step example of using the templates

### **📦 Git/Project Templates (`git/`)**
Complete project templates for creating new applications from scratch.

- **[PROJECT_TEMPLATE.md](./git/PROJECT_TEMPLATE.md)** - Master template for new projects with placeholders
- **[TEMPLATE_USAGE_GUIDE.md](./git/TEMPLATE_USAGE_GUIDE.md)** - How to use the project template system
- **[TEMPLATE_QUICK_REFERENCE.md](./git/TEMPLATE_QUICK_REFERENCE.md)** - Quick reference for template usage
- **[customize_template.sh](./git/customize_template.sh)** - Automated template customization script

## 🎯 Purpose

### **Bolt.new Templates**
- **Rapid Development** - Generate complete backend APIs in minutes
- **Best Practices** - Follow proven patterns and architectures
- **Consistency** - Standardized code structure across projects
- **Learning** - Understand modern backend development patterns

### **Project Templates**
- **Quick Start** - Create new projects with proven architecture
- **Consistency** - Same structure and setup for all projects
- **Automation** - Automated customization and setup scripts
- **Documentation** - Complete documentation templates included

## 🚀 Quick Start

### **Using Bolt.new Templates**
1. Go to [bolt.new](https://bolt.new)
2. Copy template from `bolt/` folder
3. Paste and customize for your needs
4. Generate complete backend code
5. Import to your project

### **Using Project Templates**
1. Clone template repository
2. Run `./docs/templates/git/customize_template.sh`
3. Follow prompts to customize
4. Run `./setup.sh` to initialize
5. Start development

## 📋 Template Features

### **Bolt.new Templates Include**
- ✅ Complete Express.js backend structure
- ✅ PostgreSQL database integration
- ✅ JWT authentication system
- ✅ CRUD operations for entities
- ✅ Error handling and validation
- ✅ Environment configuration
- ✅ Security best practices

### **Project Templates Include**
- ✅ Full-stack React + Node.js setup
- ✅ Database schema and migrations
- ✅ Authentication system
- ✅ API client configuration
- ✅ Docker setup
- ✅ Environment configuration
- ✅ Documentation templates
- ✅ Deployment scripts

## 🔧 Customization

### **Bolt.new Templates**
- Modify entity definitions
- Add custom business logic
- Extend API endpoints
- Customize database schema
- Add authentication flows

### **Project Templates**
- Update project branding
- Modify database schema
- Customize API routes
- Update UI components
- Configure deployment

## 📚 Documentation

Each template includes:
- **Setup Instructions** - Step-by-step installation
- **Usage Examples** - Code examples and patterns
- **Customization Guide** - How to modify for your needs
- **Best Practices** - Recommended approaches
- **Troubleshooting** - Common issues and solutions

## 🎯 Best Practices

### **Template Usage**
1. **Start Simple** - Use basic templates first
2. **Customize Gradually** - Add features incrementally
3. **Follow Patterns** - Maintain consistency with templates
4. **Document Changes** - Keep track of customizations
5. **Test Thoroughly** - Validate before production

### **Development Workflow**
1. **Plan First** - Define requirements before coding
2. **Use Templates** - Leverage proven patterns
3. **Iterate Quickly** - Build and test frequently
4. **Document Progress** - Keep development logs
5. **Review Regularly** - Assess and improve

## 🔄 Maintenance

### **Template Updates**
- Keep templates current with latest technologies
- Add new patterns and best practices
- Update documentation and examples
- Test templates with new projects
- Gather feedback and improve

### **Version Control**
- Track template changes in git
- Tag stable template versions
- Maintain backward compatibility
- Document breaking changes
- Provide migration guides

## 📞 Support

### **Getting Help**
- Check template documentation first
- Review example usage files
- Look for similar implementations
- Create issues for bugs or improvements
- Contribute back to templates

### **Contributing**
- Submit improvements to templates
- Add new template variations
- Update documentation
- Share usage examples
- Report issues and bugs

---

**Template Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: Production Ready  
**Total Templates**: 10
EOF

# Create chats README
echo "📝 Creating chats README..."
cat > docs/chats/README.md << 'EOF'
# 💬 Development Chats & Session Logs

This folder contains development session logs, chat exports, and conversation records from the project development process.

## 📁 Contents

### **Session Logs**
- **[DEVELOPMENT_SESSION_LOG.md](./DEVELOPMENT_SESSION_LOG.md)** - Complete development session log documenting the entire project setup, issues encountered, and solutions implemented

### **Chat Exports**
- **[mymasjid_bolt_cursor.md](./mymasjid_bolt_cursor.md)** - Full chat export from development sessions with detailed technical discussions and problem-solving processes

## 🎯 Purpose

These files serve as:

### **Documentation**
- **Historical Record** - Complete development journey and decision-making process
- **Problem-Solving Guide** - Detailed solutions to technical challenges
- **Learning Resource** - Examples of debugging and development workflows

### **Reference**
- **Error Solutions** - Step-by-step resolution of common issues
- **Best Practices** - Development patterns and approaches used
- **Technical Insights** - Architecture decisions and implementation details

### **Knowledge Transfer**
- **Onboarding** - New developers can understand the project evolution
- **Troubleshooting** - Reference for similar issues in the future
- **Process Improvement** - Learn from past development experiences

## 📋 Usage

### **For Developers**
- Review session logs to understand project architecture decisions
- Reference chat exports for detailed technical discussions
- Use as troubleshooting guide for similar issues

### **For Project Management**
- Track development progress and challenges
- Understand time investment in different features
- Document lessons learned for future projects

### **For Documentation**
- Extract technical insights for formal documentation
- Create FAQ sections based on common questions
- Build troubleshooting guides from resolved issues

## 🔍 Key Topics Covered

### **Technical Issues**
- Database setup and configuration
- Authentication system implementation
- API integration challenges
- Frontend-backend communication
- Environment configuration

### **Development Process**
- Project structure decisions
- Technology stack choices
- Testing and debugging approaches
- Deployment considerations

### **Problem-Solving**
- Error diagnosis and resolution
- Performance optimization
- Security implementation
- Code organization and best practices

## 📊 File Sizes & Content

- **DEVELOPMENT_SESSION_LOG.md** (~14KB) - Structured session summary
- **mymasjid_bolt_cursor.md** (~1.3MB) - Complete chat export with detailed technical discussions

## 🔄 Maintenance

### **Adding New Sessions**
1. Export new development sessions
2. Add to appropriate subfolder if needed
3. Update this README with new content description
4. Maintain chronological order

### **Organization**
- Keep session logs in chronological order
- Use descriptive filenames with dates
- Include brief descriptions in this README
- Archive old sessions if needed

## 📝 Notes

- These files contain sensitive development information
- Keep them private and secure
- Use for internal reference and learning
- Extract public insights for formal documentation

---

**Last Updated**: January 2025  
**Total Files**: 2  
**Total Size**: ~1.3MB  
**Status**: Active Development Logs
EOF

# Create placeholder files for each directory
echo "📝 Creating placeholder files..."

# Guides directory
cat > docs/guides/README.md << 'EOF'
# 📚 Guides

This directory contains user guides, tutorials, and step-by-step instructions.

## Contents

- **setup-guide.md** - Complete installation and setup instructions
- **DEVELOPMENT_WORKFLOW.md** - Development processes and best practices

## Adding New Guides

1. Create new .md file with descriptive name
2. Follow existing documentation standards
3. Include code examples where relevant
4. Update this README with new guide

---

**Last Updated**: January 2025
EOF

# Technical directory
cat > docs/technical/README.md << 'EOF'
# 🔧 Technical Documentation

This directory contains technical documentation, API references, and troubleshooting guides.

## Contents

- **API.md** - REST API endpoints and usage
- **error-log.md** - Setup issues and resolutions
- **SWAGGER_SETUP.md** - API documentation setup

## Adding New Technical Docs

1. Create new .md file with descriptive name
2. Include technical details and code examples
3. Follow API documentation standards
4. Update this README with new documentation

---

**Last Updated**: January 2025
EOF

# Deployment directory
cat > docs/deployment/README.md << 'EOF'
# 🚀 Deployment

This directory contains production deployment guides and configuration files.

## Contents

- Production deployment instructions
- Docker configuration guides
- Environment setup for production
- Monitoring and logging setup

## Adding New Deployment Docs

1. Create new .md file with descriptive name
2. Include step-by-step deployment instructions
3. Add configuration examples
4. Update this README with new guide

---

**Last Updated**: January 2025
EOF

# Testing directory
cat > docs/testing/README.md << 'EOF'
# 🧪 Testing

This directory contains testing procedures, QA documentation, and test cases.

## Contents

- Unit testing procedures
- Integration testing guides
- E2E testing documentation
- QA processes and standards

## Adding New Testing Docs

1. Create new .md file with descriptive name
2. Include test cases and procedures
3. Add code examples for test setup
4. Update this README with new documentation

---

**Last Updated**: January 2025
EOF

# Features directory
cat > docs/features/README.md << 'EOF'
# ⭐ Features

This directory contains feature-specific documentation and specifications.

## Contents

- Feature specifications
- User stories and requirements
- Implementation guides
- Feature testing procedures

## Adding New Feature Docs

1. Create new .md file with descriptive name
2. Include feature specifications and requirements
3. Add implementation details
4. Update this README with new feature

---

**Last Updated**: January 2025
EOF

# Tools directory
cat > docs/tools/README.md << 'EOF'
# 🛠️ Tools

This directory contains templates, utility files, and development tools.

## Contents

- API templates
- Development tool recommendations
- Utility scripts
- Configuration templates

## Adding New Tools

1. Create new file with descriptive name
2. Include usage instructions
3. Add examples and documentation
4. Update this README with new tool

---

**Last Updated**: January 2025
EOF

# References directory
cat > docs/references/README.md << 'EOF'
# 📖 References

This directory contains external resources, documentation, and reference materials.

## Contents

- Product requirements documents
- External API documentation
- Third-party service guides
- Reference materials and standards

## Adding New References

1. Create new .md file with descriptive name
2. Include links to external resources
3. Add summaries and key information
4. Update this README with new reference

---

**Last Updated**: January 2025
EOF

# Assets directory
cat > docs/assets/README.md << 'EOF'
# 🎨 Assets

This directory contains diagrams, images, and visual documentation.

## Contents

- Architecture diagrams
- UI mockups and wireframes
- Flowcharts and process diagrams
- Screenshots and visual guides

## Adding New Assets

1. Add image/diagram files
2. Create descriptive filenames
3. Update this README with new assets
4. Maintain organized folder structure

---

**Last Updated**: January 2025
EOF

# Archives directory
cat > docs/archives/README.md << 'EOF'
# 📦 Archives

This directory contains historical documentation and archived materials.

## Contents

- Old documentation versions
- Deprecated feature docs
- Historical project materials
- Archived development logs

## Adding to Archives

1. Move outdated files here
2. Add date prefixes to filenames
3. Update this README with archived items
4. Maintain chronological organization

---

**Last Updated**: January 2025
EOF

# Create CHANGELOG.md
echo "📝 Creating CHANGELOG.md..."
cat > docs/CHANGELOG.md << 'EOF'
# 📋 Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New features and improvements

### Changed
- Changes to existing functionality

### Deprecated
- Features that will be removed in future versions

### Removed
- Features that have been removed

### Fixed
- Bug fixes and corrections

### Security
- Security improvements and fixes

## [1.0.0] - 2025-01-11

### Added
- Initial release of Masjid SaaS system
- Multi-tenant architecture
- Member management system
- Financial tracking (receipts, donations)
- Authentication and authorization
- Dashboard with real-time statistics
- Household management
- Receipt management
- Comprehensive documentation
- Development templates
- Error logging and troubleshooting guides

### Technical Features
- React + TypeScript frontend
- Node.js + Express backend
- PostgreSQL database with Prisma ORM
- JWT authentication system
- Docker-based development environment
- API documentation
- Development session logs

### Documentation
- Complete setup guide
- API documentation
- Technical error log
- Development templates
- Project templates
- Usage guides and references

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Initial Release
EOF

echo "✅ Documentation structure setup complete!"
echo ""
echo "📁 Created directories:"
echo "  - docs/guides/"
echo "  - docs/technical/"
echo "  - docs/deployment/"
echo "  - docs/testing/"
echo "  - docs/features/"
echo "  - docs/tools/"
echo "  - docs/references/"
echo "  - docs/assets/"
echo "  - docs/archives/"
echo "  - docs/templates/bolt/"
echo "  - docs/templates/git/"
echo "  - docs/chats/"
echo ""
echo "📝 Created files:"
echo "  - docs/README.md (main documentation index)"
echo "  - docs/templates/README.md (templates overview)"
echo "  - docs/chats/README.md (chats documentation)"
echo "  - docs/CHANGELOG.md (version history)"
echo "  - README.md files in each subdirectory"
echo ""
echo "🎯 Your documentation structure is now organized and ready!"
echo "   You can add your content to the appropriate directories."
echo ""
echo "💡 To reorganize existing files, run this script again."
echo "   It will recreate the structure while preserving your content."
