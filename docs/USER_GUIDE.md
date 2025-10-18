# User Guide

## Getting Started

### Accessing the System

1. **Open your web browser** and navigate to the MNR Client Intake System URL
2. **Login** using your provided credentials
3. **Choose your task**:
   - Submit a new client intake form
   - Access the admin dashboard
   - View existing client data

### Login Process

1. **Enter your username** in the username field
2. **Enter your password** in the password field
3. **Click "Sign in"** to access the system
4. **If login fails**, verify your credentials and try again

#### Available User Accounts

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| Admin | admin | admin123 | Full system access |
| Manager | manager | manager123 | Management functions |
| Staff | staff1 | staff123 | Standard operations |
| Staff | staff2 | staff456 | Standard operations |

## Client Intake Form

### Overview

The client intake form is divided into 6 sections, each collecting specific information about the client. All sections must be completed before submission.

### Section A - Organization Details

**Required Fields:**
- **Legal Name**: The official legal name of the organization
- **Type**: Select from Company, Partnership, Individual, NGO, or Other
- **Owner/Primary Contact**: Name of the main contact person
- **Business Address**: Complete business address
- **Phone (Mobile)**: Primary contact number
- **Email**: Business email address
- **Nature of Business**: Brief description of what the business does

**Optional Fields:**
- **Trade Name**: Any trading name used
- **City, State, ZIP Code, Country**: Additional address details
- **Phone (Landline)**: Secondary contact number
- **Website**: Company website URL
- **Industry**: Business industry classification
- **Client Priority**: Priority level (LOW, MEDIUM, HIGH, VIP)

**Fill Sample Data**: Click the "🪄 Fill Sample Data" button to populate this section with test data.

### Section B - Services Needed

**Required Fields:**
- **Service Type**: Select one or more services needed
  - Direct Tax
  - Indirect Tax
  - HR Services
  - SLTDA
  - Trade License

**Optional Fields:**
- **Frequency**: How often services are needed (Monthly, Quarterly, Annual)
- **TIN**: Tax Identification Number (required if tax services are selected)

**Fill Sample Data**: Click the "🪄 Fill Sample Data" button to populate this section with test data.

### Section C - Tax Profile

**Optional Fields:**
- **Registered Tax Types**: Select applicable tax registrations
  - Income Tax
  - VAT
  - SSCL
  - APIT
  - WHT/AIT
- **Other Registrations**: Any additional registrations or notes

**Fill Sample Data**: Click the "🪄 Fill Sample Data" button to populate this section with test data.

### Section D - Secretarial & Related Parties

**Required for Companies:**
- **Company Secretary**: Name of the company secretary

**Optional Fields:**
- **Registration Number**: Company registration number
- **Incorporation Date**: Date of incorporation
- **Annual Revenue**: Annual revenue amount
- **Employee Count**: Number of employees
- **Related Parties**: Up to 4 related parties with:
  - Name
  - Relationship (Director, Partner, Owner, etc.)
  - TIN (optional)
  - Email (optional)
  - Phone (optional)

**Fill Sample Data**: Click the "🪄 Fill Sample Data" button to populate this section with test data.

### Section E - RAMIS & Documents

**Required Fields:**
- **RAMIS Access**: Select Available or Not Available

**Optional Fields:**
- **RAMIS Email/Username**: If RAMIS is available
- **Documents Provided**: Check boxes for available documents
  - Business Registration
  - Deed Copy
  - Vehicle Registration
  - Other documents (specify)

**Fill Sample Data**: Click the "🪄 Fill Sample Data" button to populate this section with test data.

### Section F - Financial Terms

**Optional Fields:**
- **Credit Limit**: Credit limit amount
- **Payment Terms**: Payment terms (e.g., Net 30)
- **Preferred Currency**: Currency preference
- **Additional Notes**: Any additional notes or requirements
- **Consent**: Check to confirm accuracy and authorize use

**Fill Sample Data**: Click the "🪄 Fill Sample Data" button to populate this section with test data.

### Form Navigation

- **Previous/Next**: Use the navigation buttons to move between sections
- **Submit**: Complete the form and submit (requires authentication)
- **Fill Sample Data**: Use these buttons in each section for testing

## Admin Dashboard

### Overview

The admin dashboard provides comprehensive client management capabilities for authorized users.

### Accessing the Dashboard

1. **Login** to the system with admin or manager credentials
2. **Navigate** to the admin section
3. **View** the client management interface

### Client List View

**Features:**
- **Search**: Use the search bar to find specific clients
- **Filter**: Filter by client type, service, tax type, or RAMIS status
- **Sort**: Sort by any column (name, date, type, etc.)
- **Pagination**: Navigate through multiple pages of results

**Columns Displayed:**
- Legal Name
- Type
- Owner Name
- Services
- RAMIS Status
- Submitted Date
- Actions

### Client Actions

**View Details:**
1. Click the **👁️ (eye) icon** in the Actions column
2. View complete client information in a detailed modal
3. Close the modal when finished

**Export Data:**
1. Click the **📥 (download) icon** for Excel export
2. Click the **📄 (document) icon** for CSV export
3. Files will download automatically

**Delete Record:**
1. Click the **🗑️ (trash) icon** in the Actions column
2. Enter the delete passcode: `MNR_DELETE_2024`
3. Confirm deletion
4. Record will be soft-deleted (preserved for audit)

### Detailed Client View

**Information Sections:**
- **Organization Details**: Complete business information
- **Services & Tax**: Selected services and tax information
- **Company Details**: Registration and financial information
- **RAMIS & Documents**: Document status and availability
- **Financial Terms**: Credit and payment information
- **Related Parties**: Associated individuals and entities
- **Additional Information**: Notes, consent, and audit trail

**Features:**
- **Responsive Design**: Works on all screen sizes
- **Print Friendly**: Can be printed for records
- **Export Options**: Export individual client data

## Data Export

### Excel Export

**Single Client:**
1. Go to the client list
2. Click the Excel download icon for the desired client
3. File will download as `client-intake-[ID].xlsx`

**All Clients:**
1. Use the "Export All" button in the dashboard
2. File will download as `all-client-intakes.xlsx`

**Excel File Contents:**
- All client information in organized columns
- Related parties in separate rows
- Formatted for easy reading and analysis

### CSV Export

**Single Client:**
1. Go to the client list
2. Click the CSV download icon for the desired client
3. File will download as `client-intake-[ID].csv`

**All Clients:**
1. Use the "Export All CSV" button in the dashboard
2. File will download as `all-client-intakes.csv`

**CSV File Contents:**
- Comma-separated values
- Compatible with Excel and other spreadsheet applications
- Easy to import into other systems

## User Management

### User Roles

**Admin:**
- Full system access
- Can view, create, edit, and delete all records
- Access to audit logs
- User management capabilities

**Manager:**
- Management-level access
- Can view and manage client records
- Limited administrative functions
- Access to reporting features

**Staff:**
- Standard operational access
- Can create and view client records
- Limited to assigned functions
- Basic reporting access

### Audit Trail

**What's Tracked:**
- All form submissions
- User logins and logouts
- Data modifications
- Export activities
- Delete operations

**Viewing Audit Logs:**
1. Access the audit section (admin only)
2. View chronological list of activities
3. Filter by user, action, or date
4. Export audit reports if needed

## Troubleshooting

### Common Issues

**Login Problems:**
- Verify username and password are correct
- Check if account is active
- Clear browser cache and cookies
- Try a different browser

**Form Submission Errors:**
- Ensure all required fields are completed
- Check internet connection
- Verify authentication is still active
- Try refreshing the page

**Export Issues:**
- Ensure you have permission to export data
- Check if the client record exists
- Try downloading again
- Contact administrator if problems persist

**Display Problems:**
- Refresh the page
- Clear browser cache
- Check internet connection
- Try a different browser

### Getting Help

**Self-Service:**
1. Check this user guide
2. Review error messages carefully
3. Try the troubleshooting steps above

**Contact Support:**
- For technical issues, contact the IT department
- For data questions, contact your supervisor
- For system access, contact the administrator

## Best Practices

### Data Entry

**Accuracy:**
- Double-check all information before submitting
- Use consistent formatting for names and addresses
- Verify email addresses and phone numbers
- Complete all relevant fields

**Efficiency:**
- Use the "Fill Sample Data" buttons for testing
- Save work frequently
- Use the navigation buttons to move between sections
- Review all information before final submission

### Security

**Login Security:**
- Use strong passwords
- Log out when finished
- Don't share login credentials
- Report suspicious activity

**Data Security:**
- Only access data you need
- Don't leave the system open unattended
- Follow company data handling policies
- Report any data breaches immediately

### Record Keeping

**Documentation:**
- Keep copies of important exports
- Document any issues or problems
- Follow company record retention policies
- Maintain audit trail integrity

## System Requirements

### Browser Compatibility

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Required Features:**
- JavaScript enabled
- Cookies enabled
- Local storage enabled
- Pop-up blocker disabled for exports

### Network Requirements

**Internet Connection:**
- Stable internet connection required
- Minimum 1 Mbps download speed
- Reliable connection for form submission

**Security:**
- HTTPS connection recommended
- Firewall settings may need adjustment
- VPN compatibility available

---

**Need more help?** Contact your system administrator or refer to the technical documentation.
