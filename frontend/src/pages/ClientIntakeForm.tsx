import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ClientIntake } from '../types';
import { clientIntakeApi } from '../lib/api';
import { SectionA } from '../components/form/SectionA';
import { SectionB } from '../components/form/SectionB';
import { SectionC } from '../components/form/SectionC';
import { SectionD } from '../components/form/SectionD';
import { SectionE } from '../components/form/SectionE';
import { SectionF } from '../components/form/SectionF';
import { FormProgress } from '../components/form/FormProgress';
import { FormNavigation } from '../components/form/FormNavigation';
import { SuccessMessage } from '../components/ui/SuccessMessage';
import { ErrorMessage } from '../components/ui/ErrorMessage';

const formSchema = z.object({
  // Section A - Organization Details
  legalName: z.string().min(1, 'Legal name is required'),
  tradeName: z.string().optional(),
  type: z.enum(['INDIVIDUAL', 'PARTNERSHIP', 'COMPANY', 'NGO', 'OTHER']),
  ownerName: z.string().min(1, 'Owner/Primary contact name is required'),
  address: z.string().min(1, 'Business address is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  phoneMobile: z.string().min(1, 'Mobile phone is required'),
  phoneLand: z.string().optional(),
  email: z.string().email('Valid email is required'),
  website: z.string().url().optional().or(z.literal('')),
  natureOfBusiness: z.string().min(1, 'Nature of business is required'),
  industry: z.string().optional(),
  clientPriority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'VIP']).optional(),
  
  // Section B - Services
  servicesSelected: z.array(z.string()).min(1, 'At least one service must be selected'),
  serviceFrequency: z.string().optional(),
  tin: z.string().optional(),
  
  // Section C - Tax Profile
  taxTypesSelected: z.array(z.string()).optional(),
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
  
  // Section F - Financial Terms
  creditLimit: z.number().optional(),
  paymentTerms: z.string().optional(),
  preferredCurrency: z.string().optional(),
  
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
  // TIN required when tax services are selected
  if (data.servicesSelected.includes('Direct Tax') || data.servicesSelected.includes('Indirect Tax')) {
    return data.tin && data.tin.length > 0;
  }
  return true;
}, {
  message: 'TIN is required when tax services are selected',
  path: ['tin']
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
  { id: 'section-b', title: 'Services Needed', description: 'Service requirements and frequency' },
  { id: 'section-c', title: 'Tax Profile', description: 'Tax registrations and compliance' },
  { id: 'section-d', title: 'Related Parties', description: 'Directors, partners, and key personnel' },
  { id: 'section-e', title: 'RAMIS & Documents', description: 'System access and document tracking' },
  { id: 'section-f', title: 'Financial Terms', description: 'Payment terms and preferences' }
];

export function ClientIntakeForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
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
      preferredCurrency: 'USD',
      servicesSelected: [],
      taxTypesSelected: [],
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
        setSubmitSuccess(true);
        // Reset form
        form.reset();
        setCurrentSection(0);
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

  if (submitSuccess) {
    return <SuccessMessage />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
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
              <SectionC form={form} errors={errors} />
            )}
            {currentSection === 3 && (
              <SectionD form={form} errors={errors} />
            )}
            {currentSection === 4 && (
              <SectionE form={form} errors={errors} />
            )}
            {currentSection === 5 && (
              <SectionF form={form} errors={errors} />
            )}
          </div>
        </div>

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
