import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Calendar, UserCheck, AlertCircle, Shield } from 'lucide-react';
import { StaffFormData, StaffStatus, Role } from '../../types/staff';
import { API_BASE_URL } from '../../lib/apiConfig';

interface SectionBProps {
  register: UseFormReturn<StaffFormData>['register'];
  errors: UseFormReturn<StaffFormData>['formState']['errors'];
  setValue: UseFormReturn<StaffFormData>['setValue'];
  watch: UseFormReturn<StaffFormData>['watch'];
}

const STATUS_OPTIONS: { value: StaffStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'RESIGNED', label: 'Resigned' },
  { value: 'STUDY_LEAVE', label: 'Study Leave' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export function SectionB({ register, errors, setValue, watch }: SectionBProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const status = watch('status');
  const roleIds = watch('roleIds') || [];

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/roles`);
        if (response.ok) {
          const data = await response.json();
          setRoles(data);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Update selected roles when roleIds changes
  useEffect(() => {
    setSelectedRoles(roleIds);
  }, [roleIds]);

  const handleRoleChange = (roleId: string, checked: boolean) => {
    let newRoles;
    if (checked) {
      newRoles = [...selectedRoles, roleId];
    } else {
      newRoles = selectedRoles.filter(id => id !== roleId);
    }
    setSelectedRoles(newRoles);
    setValue('roleIds', newRoles);
  };

  const fillSampleData = () => {
    setValue('hireDate', new Date());
    setValue('status', 'ACTIVE');
    setValue('resignDate', undefined);
    setValue('resignReason', '');
    if (roles.length > 0) {
      setValue('roleIds', [roles[0].id]);
      setSelectedRoles([roles[0].id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <UserCheck className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Employment Details</h2>
            <p className="text-sm text-gray-600">Work status, dates, and role assignments</p>
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
        {/* Hire Date */}
        <div className="form-group">
          <label className="form-label">
            Hire Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              {...register('hireDate', { valueAsDate: true })}
              type="date"
              className="form-input pl-10"
            />
          </div>
          {errors.hireDate && (
            <p className="error-message">{errors.hireDate.message}</p>
          )}
        </div>

        {/* Status */}
        <div className="form-group">
          <label className="form-label">
            Employment Status <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              {...register('status')}
              className="form-input pl-10"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {errors.status && (
            <p className="error-message">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Conditional Fields for Resigned Status */}
      {status === 'RESIGNED' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">Resignation Details</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Please provide the resignation date and reason.
              </p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Resign Date */}
            <div className="form-group">
              <label className="form-label">
                Resignation Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...register('resignDate', { valueAsDate: true })}
                  type="date"
                  className="form-input pl-10"
                />
              </div>
              {errors.resignDate && (
                <p className="error-message">{errors.resignDate.message}</p>
              )}
            </div>

            {/* Resign Reason */}
            <div className="form-group">
              <label className="form-label">Resignation Reason</label>
              <input
                {...register('resignReason')}
                type="text"
                className="form-input"
                placeholder="Enter resignation reason"
              />
              {errors.resignReason && (
                <p className="error-message">{errors.resignReason.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Roles Assignment */}
      <div className="form-group">
        <label className="form-label">
          Assign Roles <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Select one or more roles for this staff member
        </p>
        
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-gray-600">Loading roles...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {roles.map((role) => (
              <label
                key={role.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedRoles.includes(role.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.id)}
                  onChange={(e) => handleRoleChange(role.id, e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {role.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {role.type} • {role.description || 'No description'}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}
        
        {errors.roleIds && (
          <p className="error-message mt-2">{errors.roleIds.message}</p>
        )}
      </div>
    </div>
  );
}
