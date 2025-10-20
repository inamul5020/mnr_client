# MNR Client Intake - Complete Edit Form Fields Reference

## 🎯 **All Editable Fields in Admin Dashboard**

The edit form now includes **ALL** fields from the ClientIntake interface, organized into logical sections:

---

## 📋 **Section A - Organization Details**

### **Basic Information**
- ✅ **Legal Name** *(Required)*
- ✅ **Trade Name**
- ✅ **Type** *(Required)* - Individual, Partnership, Company, NGO, Other
- ✅ **Owner/Primary Contact** *(Required)*
- ✅ **Address** *(Required)*
- ✅ **City**
- ✅ **State**
- ✅ **Zip Code**
- ✅ **Country**

### **Contact Information**
- ✅ **Mobile Phone** *(Required)*
- ✅ **Land Phone**
- ✅ **Email** *(Required)*
- ✅ **Website**

### **Business Information**
- ✅ **Nature of Business** *(Required)*
- ✅ **Industry** - Dropdown with 13 options
- ✅ **Client Priority** - Low, Medium, High, VIP

---

## 📋 **Section B - Services & Tax Profile**

### **Service Selection**
- ✅ **Services Selected** *(Required)* - All 7 services:
  - Direct Tax
  - Indirect Tax
  - HR Services
  - SLTDA
  - Trade License
  - Accounts
  - Audit

### **Tax Subcategories** *(Dynamic based on service selection)*
- ✅ **Direct Tax Subcategories** - Income Taxes, Capital Gain Tax
- ✅ **Indirect Tax Subcategories** - VAT, SSCL, APIT, WHT/AIT

### **Service Configuration**
- ✅ **Service Frequencies** - Per-service dropdown (Monthly, Quarterly, Annually)
- ✅ **TIN**
- ✅ **Other Registrations** - Textarea

### **RAMIS Information**
- ✅ **RAMIS Status** - Available, Not Available
- ✅ **RAMIS Email**

---

## 📋 **Section C - Company Details**

### **Company Information**
- ✅ **Company Secretary**
- ✅ **Registration Number**
- ✅ **Incorporation Date** - Date picker
- ✅ **Annual Revenue** - Number input
- ✅ **Employee Count** - Number input

---

## 📋 **Section D - Documents & Financial**

### **Document Availability**
- ✅ **Business Registration** - Checkbox
- ✅ **Deed** - Checkbox
- ✅ **Vehicle Registration** - Checkbox
- ✅ **Other Document 1** - Text input
- ✅ **Other Document 2** - Text input

### **Compliance & Financial**
- ✅ **Compliance Notes** - Textarea
- ✅ **Credit Limit** - Number input
- ✅ **Payment Terms** - Dropdown (Net 15, 30, 45, 60, Due on Receipt)
- ✅ **Preferred Currency** - Dropdown (USD, LKR, EUR, GBP, AUD, CAD)

---

## 📋 **Section E - Additional Information**

### **Notes & Consent**
- ✅ **Notes** - Textarea
- ✅ **Consent Given** *(Required)* - Checkbox

---

## 🎨 **Form Features**

### **Dynamic Fields**
- **Tax Subcategories** appear only when Direct Tax or Indirect Tax is selected
- **Service Frequencies** show dropdowns for each selected service
- **Company Details** section available for all client types

### **Validation**
- **Required fields** marked with asterisk (*)
- **Real-time validation** with error messages
- **Email format validation**
- **Service selection validation**

### **User Experience**
- **Organized sections** with clear headings
- **Responsive layout** - 2 columns on desktop, 1 column on mobile
- **Proper input types** - email, tel, url, date, number
- **Dropdowns** for standardized values
- **Checkboxes** for multiple selections
- **Textareas** for longer text

---

## 🔧 **Technical Implementation**

### **Form State Management**
- Uses React state for form data
- Real-time updates with `handleEditFormChange`
- Error state management with `editErrors`
- Validation before submission

### **Data Structure**
- All fields map to `ClientIntake` interface
- Proper type checking with TypeScript
- Handles optional fields gracefully
- Maintains data integrity

### **API Integration**
- Updates via `clientIntakeApi.update()`
- Proper error handling
- Success feedback to user
- Automatic refresh of client list

---

## 📊 **Field Count Summary**

| **Section** | **Field Count** | **Required Fields** |
|-------------|-----------------|---------------------|
| Organization Details | 13 | 6 |
| Services & Tax | 8 | 1 |
| Company Details | 5 | 0 |
| Documents & Financial | 8 | 0 |
| Additional Info | 2 | 1 |
| **TOTAL** | **36** | **8** |

---

## 🚀 **Usage Instructions**

1. **Access Edit Form**: Click the Edit button (pencil icon) next to any client in the admin dashboard
2. **Navigate Sections**: Scroll through the organized sections
3. **Dynamic Fields**: Select services to see related subcategories and frequencies
4. **Validation**: Required fields are marked and validated
5. **Save Changes**: Click "Save Changes" to update the client
6. **Cancel**: Click "Cancel" to discard changes

**The edit form now provides complete control over all client data fields!** 🎉
