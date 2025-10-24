import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { ClientIntake } from '../types';
import { clientIntakeApi } from '../lib/api';
import { SectionA } from '../components/form/SectionA';
import { SectionB } from '../components/form/SectionB';
import { SectionD } from '../components/form/SectionD';
import { SectionE } from '../components/form/SectionE';
import { FormProgress } from '../components/form/FormProgress';
import { FormNavigation } from '../components/form/FormNavigation';
import { FormDebug } from '../components/form/FormDebug';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Users, ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  // Section A - Organization Details
  legalName: z.string().min(1, 'Legal name is required'),
  tradeName: z.string().optional(),
  type: z.enum(['INDIVIDUAL', 'PARTNERSHIP', 'COMPANY', 'NGO', 'OTHER']),
  managedBy: z.string().optional(),
  managedByContactName: z.string().optional(),
  ownerName: z.string().min(1, 'Owner/Primary contact name is required'),
  address: z.string().min(1, 'Business address is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  phoneMobile: z.string().optional(),
  phoneLand: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  natureOfBusiness: z.string().optional(),
  industry: z.string().optional(),
  clientPriority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'VIP']).optional(),
  
  // Section B - Services & Tax Profile (merged)
  servicesSelected: z.array(z.string()).min(1, 'At least one service must be selected'),
  directTaxSubcategories: z.array(z.string()).optional(),
  indirectTaxSubcategories: z.array(z.string()).optional(),
  incomeTaxTypes: z.array(z.string()).optional(),
  serviceFrequencies: z.record(z.string()).optional(),
  taxReturnYears: z.record(z.array(z.string())).optional(),
  tin: z.string().optional(),
  otherRegistrations: z.string().optional(),
  
  // Section D - Related Parties & Company Details
  companySecretary: z.string().optional(),
  registrationNumber: z.string().optional(),
  incorporationDate: z.string().optional(),
  annualRevenue: z.number().optional(),
  employeeCount: z.number().optional(),
  
  // Section E - RAMIS & Documents
  ramisStatus: z.enum(['AVAILABLE', 'NOT_AVAILABLE']),
  ramisEmail: z.string().email().optional().or(z.literal('')),
  docsBusinessReg: z.boolean().optional(),
  docsDeed: z.boolean().optional(),
  docsVehicleReg: z.boolean().optional(),
  docsOther1: z.string().optional(),
  docsOther2: z.string().optional(),
  complianceNotes: z.string().optional(),
  
  // Metadata
  notes: z.string().optional(),
  consent: z.boolean().refine(val => val === true, 'Consent must be given'),
  
  // Related parties
  relatedParties: z.array(z.object({
    name: z.string().min(1, 'Name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    tin: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional()
  })).optional()
}).refine((data) => {
  // Direct Tax subcategories required when Direct Tax is selected
  if (data.servicesSelected.includes('Direct Tax')) {
    return data.directTaxSubcategories && data.directTaxSubcategories.length > 0;
  }
  return true;
}, {
  message: 'At least one Direct Tax subcategory must be selected',
  path: ['directTaxSubcategories']
}).refine((data) => {
  // Indirect Tax subcategories required when Indirect Tax is selected
  if (data.servicesSelected.includes('Indirect Tax')) {
    return data.indirectTaxSubcategories && data.indirectTaxSubcategories.length > 0;
  }
  return true;
}, {
  message: 'At least one Indirect Tax subcategory must be selected',
  path: ['indirectTaxSubcategories']
}).refine((data) => {
  // Company Secretary required for Company type
  if (data.type === 'COMPANY') {
    return data.companySecretary && data.companySecretary.length > 0;
  }
  return true;
}, {
  message: 'Company Secretary is required for Company type',
  path: ['companySecretary']
});

export type FormData = z.infer<typeof formSchema>;

const SECTIONS = [
  { id: 'section-a', title: 'Organization Details', description: 'Basic client information' },
  { id: 'section-b', title: 'Services & Tax Profile', description: 'Service requirements and tax information' },
  { id: 'section-d', title: 'Related Parties', description: 'Directors, partners, and key personnel' },
  { id: 'section-e', title: 'RAMIS & Documents', description: 'System access and document tracking' }
];

export function ClientIntakeForm() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'INDIVIDUAL',
      ramisStatus: 'NOT_AVAILABLE',
      docsBusinessReg: false,
      docsDeed: false,
      docsVehicleReg: false,
      clientPriority: 'MEDIUM',
      servicesSelected: [],
      directTaxSubcategories: [],
      indirectTaxSubcategories: [],
      incomeTaxTypes: [],
      serviceFrequencies: {},
      taxReturnYears: {},
      relatedParties: [],
      consent: false
    },
    mode: 'onChange'
  });

  const { handleSubmit, formState: { errors, isValid } } = form;

  const nextSection = () => {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await clientIntakeApi.create(data as ClientIntake);
      
      if (response.success) {
        // Navigate to success page instead of setting local state
        navigate('/success');
      } else {
        setSubmitError(response.error || 'Failed to submit form');
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      setSubmitError(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Failed to submit form. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation buttons for easy access to dashboard */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-between mb-4">
          <a
            href="/admin"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </a>
          <div className="flex-1"></div>
          <a
            href="/admin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <Users className="h-4 w-4 mr-2" />
            View Dashboard
          </a>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Client Intake Form
        </h1>
        <p className="text-lg text-gray-600">
          Please provide comprehensive information about your organization
        </p>
      </div>

      <FormProgress 
        sections={SECTIONS} 
        currentSection={currentSection} 
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <div className="card">
          <div className="form-section">
            {currentSection === 0 && (
              <SectionA form={form} errors={errors} />
            )}
            {currentSection === 1 && (
              <SectionB form={form} errors={errors} />
            )}
            {currentSection === 2 && (
              <SectionD form={form} errors={errors} />
            )}
            {currentSection === 3 && (
              <SectionE form={form} errors={errors} />
            )}
          </div>
        </div>

        {/* Debug component - remove in production */}
        <FormDebug />

        {submitError && (
          <ErrorMessage message={submitError} />
        )}

        <FormNavigation
          currentSection={currentSection}
          totalSections={SECTIONS.length}
          onNext={nextSection}
          onPrev={prevSection}
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
          isValid={isValid}
        />
      </form>
    </div>
  );
}
