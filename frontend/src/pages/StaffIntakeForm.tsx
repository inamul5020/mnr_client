import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { StaffFormData } from '../types/staff';
import { API_BASE_URL } from '../lib/apiConfig';
import { SectionA } from '../components/staff-form/SectionA';
import { SectionB } from '../components/staff-form/SectionB';
import { SectionC } from '../components/staff-form/SectionC';

// Form validation schema
const staffFormSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  photoUrl: z.string().optional(),
  departmentId: z.string().min(1, 'Department is required'),
  hireDate: z.date(),
  status: z.enum(['ACTIVE', 'RESIGNED', 'STUDY_LEAVE', 'INACTIVE']),
  resignDate: z.date().optional(),
  resignReason: z.string().optional(),
  roleIds: z.array(z.string()).min(1, 'At least one role is required'),
  createUserAccount: z.boolean().default(true),
}).refine((data) => {
  if (data.status === 'RESIGNED') {
    return data.resignDate !== undefined;
  }
  return true;
}, {
  message: 'Resign date is required when status is RESIGNED',
  path: ['resignDate']
});

const sections = [
  { id: 'basic', title: 'Basic Information', description: 'Personal details and contact information' },
  { id: 'employment', title: 'Employment Details', description: 'Work status, dates, and role assignments' },
  { id: 'account', title: 'User Account', description: 'Create system access credentials' },
];

export function StaffIntakeForm() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      employeeId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      photoUrl: '',
      departmentId: '',
      hireDate: new Date(),
      status: 'ACTIVE',
      resignDate: undefined,
      resignReason: '',
      roleIds: [],
      createUserAccount: true,
    },
  });

  const { handleSubmit, formState: { errors, isValid }, watch } = form;

  // Watch form values for validation
  const watchedValues = watch();

  // Check if current section is valid
  const isCurrentSectionValid = () => {
    switch (currentSection) {
      case 0: // Basic Information
        return !!(watchedValues.employeeId && watchedValues.firstName && watchedValues.lastName && watchedValues.email && watchedValues.departmentId);
      case 1: // Employment Details
        return !!(watchedValues.hireDate && watchedValues.status && watchedValues.roleIds.length > 0);
      case 2: // User Account
        return true; // User account section is always valid
      default:
        return false;
    }
  };

  // Handle form submission
  const onSubmit = async (data: StaffFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await fetch(`${API_BASE_URL}/api/staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        // Store user credentials for display on success page
        if (result.userCredentials) {
          sessionStorage.setItem('staffCredentials', JSON.stringify(result.userCredentials));
        }
        navigate('/staff/success');
      } else {
        const error = await response.json();
        setSubmitError(error.error || 'Failed to create staff member');
      }
    } catch (error) {
      console.error('Error creating staff member:', error);
      setSubmitError('Failed to create staff member. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation functions
  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const goToSection = (index: number) => {
    setCurrentSection(index);
  };

  // Render current section
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return <SectionA register={form.register} errors={errors} setValue={form.setValue} />;
      case 1:
        return <SectionB register={form.register} errors={errors} setValue={form.setValue} watch={form.watch} />;
      case 2:
        return <SectionC register={form.register} errors={errors} setValue={form.setValue} watch={form.watch} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-primary-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Staff Intake Form</h1>
        <p className="text-gray-600 mt-2">
          Add new staff members to the system with complete information
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {sections.map((section, index) => (
            <div key={section.id} className="flex items-center">
              <button
                onClick={() => goToSection(index)}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  index === currentSection
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : index < currentSection
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {index < currentSection ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </button>
              {index < sections.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  index < currentSection ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {sections[currentSection].title}
          </h2>
          <p className="text-sm text-gray-600">
            {sections[currentSection].description}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Current Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderCurrentSection()}
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevSection}
            disabled={currentSection === 0}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-3">
            {currentSection < sections.length - 1 ? (
              <button
                type="button"
                onClick={nextSection}
                disabled={!isCurrentSectionValid()}
                className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Staff...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Staff Member
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
