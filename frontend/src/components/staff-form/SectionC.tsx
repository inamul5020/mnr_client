import { } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { UserPlus, Mail, Key, CheckCircle, Info } from 'lucide-react';
import { StaffFormData } from '../../types/staff';

interface SectionCProps {
  register: UseFormReturn<StaffFormData>['register'];
  errors: UseFormReturn<StaffFormData>['formState']['errors'];
  setValue: UseFormReturn<StaffFormData>['setValue'];
  watch: UseFormReturn<StaffFormData>['watch'];
}

export function SectionC({ register, errors, setValue, watch }: SectionCProps) {
  const createUserAccount = watch('createUserAccount');

  const fillSampleData = () => {
    setValue('createUserAccount', true);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">User Account</h2>
            <p className="text-sm text-gray-600">Create system access credentials</p>
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

      {/* User Account Creation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-medium text-blue-900">
              Create User Account
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Automatically create a user account for this staff member to access the system.
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="mt-4">
          <label className="flex items-center cursor-pointer">
            <input
              {...register('createUserAccount')}
              type="checkbox"
              className="sr-only"
            />
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              createUserAccount ? 'bg-primary-600' : 'bg-gray-200'
            }`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                createUserAccount ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </div>
            <span className="ml-3 text-sm font-medium text-gray-900">
              Create user account for system access
            </span>
          </label>
        </div>

        {/* Account Creation Details */}
        {createUserAccount && (
          <div className="mt-6 bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Account Details
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <span className="font-medium">Username:</span>
                <span className="ml-2 text-gray-900">
                  Will be generated from email address
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Key className="h-4 w-4 text-gray-400 mr-2" />
                <span className="font-medium">Password:</span>
                <span className="ml-2 text-gray-900">
                  Will be auto-generated (12 characters)
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                <span className="font-medium">Role:</span>
                <span className="ml-2 text-gray-900">
                  STAFF (can be changed later)
                </span>
              </div>
            </div>

            {/* Information Box */}
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex">
                <Info className="h-5 w-5 text-yellow-400 mt-0.5 mr-2" />
                <div className="text-sm">
                  <p className="text-yellow-800 font-medium">Important:</p>
                  <ul className="mt-1 text-yellow-700 list-disc list-inside space-y-1">
                    <li>Login credentials will be provided after form submission</li>
                    <li>Staff member should change password on first login</li>
                    <li>Account will be created with basic STAFF permissions</li>
                    <li>Additional permissions can be assigned later by administrators</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alternative Message */}
        {!createUserAccount && (
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-gray-400 mr-2" />
              <div className="text-sm text-gray-600">
                <p className="font-medium">No user account will be created</p>
                <p className="mt-1">
                  This staff member will not have system access. You can create an account later if needed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Validation Error */}
      {errors.createUserAccount && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <Info className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
            <p className="text-sm text-red-800">
              {errors.createUserAccount.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
