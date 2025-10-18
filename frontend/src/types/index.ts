export interface ClientIntake {
  id?: string;
  
  // Section A - Organization Details
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
  clientPriority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'VIP';
  
  // Section B - Services
  servicesSelected: string[];
  serviceFrequency?: string;
  tin?: string;
  
  // Section C - Tax Profile
  taxTypesSelected: string[];
  otherRegistrations?: string;
  
  // Section D - Related Parties & Company Details
  companySecretary?: string;
  registrationNumber?: string;
  incorporationDate?: string;
  annualRevenue?: number;
  employeeCount?: number;
  
  // Section E - RAMIS & Documents
  ramisStatus: 'AVAILABLE' | 'NOT_AVAILABLE';
  ramisEmail?: string;
  docsBusinessReg: boolean;
  docsDeed: boolean;
  docsVehicleReg: boolean;
  docsOther1?: string;
  docsOther2?: string;
  complianceNotes?: string;
  
  // Section F - Financial Terms
  creditLimit?: number;
  paymentTerms?: string;
  preferredCurrency?: string;
  
  // Metadata
  notes?: string;
  consent: boolean;
  createdBy?: string;
  
  // Related parties
  relatedParties: RelatedParty[];
}

export interface RelatedParty {
  name: string;
  relationship: string;
  tin?: string;
  email?: string;
  phone?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{ msg: string; param: string }>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const CLIENT_TYPES = [
  { value: 'INDIVIDUAL', label: 'Individual' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
  { value: 'COMPANY', label: 'Company' },
  { value: 'NGO', label: 'NGO' },
  { value: 'OTHER', label: 'Other' }
];

export const INDUSTRIES = [
  'Retail & Wholesale',
  'Manufacturing',
  'Services',
  'Finance & Banking',
  'Technology',
  'Healthcare',
  'Construction',
  'Real Estate',
  'Transportation',
  'Education',
  'Government',
  'Non-Profit',
  'Other'
];

export const SERVICES = [
  'Direct Tax',
  'Indirect Tax',
  'HR Services',
  'SLTDA Services',
  'Trade License',
  'Other'
];

export const TAX_TYPES = [
  'Income Tax',
  'VAT',
  'SSCL',
  'APIT',
  'WHT/AIT'
];

export const RELATIONSHIPS = [
  'Director',
  'Partner',
  'Owner',
  'Subsidiary',
  'Associate',
  'Shareholder',
  'Other'
];

export const PAYMENT_TERMS = [
  'Net 15',
  'Net 30',
  'Net 45',
  'Net 60',
  'Due on Receipt'
];

export const CURRENCIES = [
  'USD',
  'LKR',
  'EUR',
  'GBP',
  'AUD',
  'CAD'
];
