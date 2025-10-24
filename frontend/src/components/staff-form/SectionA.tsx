import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { User, Mail, Phone, Camera, Building } from 'lucide-react';
import { StaffFormData } from '../../types/staff';
import { Department } from '../../types/staff';
import { API_BASE_URL } from '../../lib/apiConfig';

interface SectionAProps {
  register: UseFormReturn<StaffFormData>['register'];
  errors: UseFormReturn<StaffFormData>['formState']['errors'];
  setValue: UseFormReturn<StaffFormData>['setValue'];
}

export function SectionA({ register, errors, setValue }: SectionAProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/departments`);
        if (response.ok) {
          const data = await response.json();
          setDepartments(data);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Generate employee ID
  const generateEmployeeId = () => {
    const prefix = 'EMP';
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${year}${random}`;
  };

  const fillSampleData = () => {
    setValue('employeeId', generateEmployeeId());
    setValue('firstName', 'John');
    setValue('lastName', 'Doe');
    setValue('email', 'john.doe@example.com');
    setValue('phone', '+1234567890');
    setValue('photoUrl', '');
    if (departments.length > 0) {
      setValue('departmentId', departments[0].id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            <p className="text-sm text-gray-600">Personal details and contact information</p>
          </div>
        </div>
        <button
          type="button"
          onClick={fillSampleData}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Fill Sample Data
        </button>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employee ID */}
        <div className="form-group">
          <label className="form-label">
            Employee ID <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            <input
              {...register('employeeId')}
              type="text"
              className="form-input flex-1"
              placeholder="EMP250001"
            />
            <button
              type="button"
              onClick={() => setValue('employeeId', generateEmployeeId())}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Generate
            </button>
          </div>
          {errors.employeeId && (
            <p className="error-message">{errors.employeeId.message}</p>
          )}
        </div>

        {/* Department */}
        <div className="form-group">
          <label className="form-label">
            Department <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              {...register('departmentId')}
              className="form-input pl-10"
              disabled={loading}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          {errors.departmentId && (
            <p className="error-message">{errors.departmentId.message}</p>
          )}
        </div>

        {/* First Name */}
        <div className="form-group">
          <label className="form-label">
            First Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              {...register('firstName')}
              type="text"
              className="form-input pl-10"
              placeholder="Enter first name"
            />
          </div>
          {errors.firstName && (
            <p className="error-message">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label className="form-label">
            Last Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              {...register('lastName')}
              type="text"
              className="form-input pl-10"
              placeholder="Enter last name"
            />
          </div>
          {errors.lastName && (
            <p className="error-message">{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              {...register('email')}
              type="email"
              className="form-input pl-10"
              placeholder="Enter email address"
            />
          </div>
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              {...register('phone')}
              type="tel"
              className="form-input pl-10"
              placeholder="Enter phone number"
            />
          </div>
          {errors.phone && (
            <p className="error-message">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Photo Upload */}
      <div className="form-group">
        <label className="form-label">Profile Photo</label>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
          <div className="flex-1">
            <input
              {...register('photoUrl')}
              type="url"
              className="form-input"
              placeholder="Enter photo URL (optional)"
            />
            <p className="text-sm text-gray-500 mt-1">
              You can upload a photo later or provide a URL to an existing image
            </p>
          </div>
        </div>
        {errors.photoUrl && (
          <p className="error-message">{errors.photoUrl.message}</p>
        )}
      </div>
    </div>
  );
}
