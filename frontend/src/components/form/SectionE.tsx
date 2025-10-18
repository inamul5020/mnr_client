import { UseFormReturn } from 'react-hook-form';
import { FormData } from '../../pages/ClientIntakeForm';
import { Wand2 } from 'lucide-react';

interface SectionEProps {
  form: UseFormReturn<FormData>;
  errors: any;
}

export function SectionE({ form, errors }: SectionEProps) {
  const { register, watch, setValue } = form;
  const ramisStatus = watch('ramisStatus');

  const fillSampleData = () => {
    setValue('ramisStatus', 'AVAILABLE');
    setValue('ramisEmail', 'ramis@company.com');
    setValue('docsBusinessReg', true);
    setValue('docsDeed', true);
    setValue('docsVehicleReg', false);
    setValue('docsOther1', 'BOI Certificate');
    setValue('docsOther2', 'Export License');
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Section E — RAMIS & Documents
            </h2>
            <p className="text-gray-600">
              Please provide information about RAMIS access and document availability
            </p>
          </div>
          <button
            type="button"
            onClick={fillSampleData}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Fill Sample Data
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* RAMIS Access */}
        <div className="form-group">
          <label className="label">
            RAMIS Access <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                {...register('ramisStatus')}
                type="radio"
                value="AVAILABLE"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="text-sm font-medium text-gray-900">Available</span>
            </label>
            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                {...register('ramisStatus')}
                type="radio"
                value="NOT_AVAILABLE"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="text-sm font-medium text-gray-900">Not Available</span>
            </label>
          </div>
          {errors.ramisStatus && (
            <p className="error-message">{errors.ramisStatus.message}</p>
          )}
        </div>

        {/* RAMIS Email - Only if Available */}
        {ramisStatus === 'AVAILABLE' && (
          <div className="form-group">
            <label className="label">RAMIS Email/Username (Optional)</label>
            <input
              {...register('ramisEmail')}
              type="email"
              className="input"
              placeholder="RAMIS email or username"
            />
            <p className="text-sm text-gray-500 mt-1">
              We do not ask for passwords for security reasons
            </p>
          </div>
        )}

        {/* Document Checklist */}
        <div className="form-group">
          <label className="label">Documents Provided Now (Optional)</label>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                {...register('docsBusinessReg')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-900">Business Registration</span>
            </label>
            
            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                {...register('docsDeed')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-900">Deed Copy</span>
            </label>
            
            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                {...register('docsVehicleReg')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-900">Vehicle Registration</span>
            </label>
          </div>
        </div>

        {/* Other Documents */}
        <div className="form-row">
          <div className="form-group">
            <label className="label">Other Document 1 (Optional)</label>
            <input
              {...register('docsOther1')}
              className="input"
              placeholder="Describe other document provided"
            />
          </div>

          <div className="form-group">
            <label className="label">Other Document 2 (Optional)</label>
            <input
              {...register('docsOther2')}
              className="input"
              placeholder="Describe other document provided"
            />
          </div>
        </div>

        {/* Compliance Notes */}
        <div className="form-group">
          <label className="label">Compliance Notes (Optional)</label>
          <textarea
            {...register('complianceNotes')}
            className="input min-h-[100px]"
            placeholder="Any additional compliance-related notes or requirements"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
