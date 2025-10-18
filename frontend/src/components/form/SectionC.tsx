import { UseFormReturn } from 'react-hook-form';
import { FormData } from '../../pages/ClientIntakeForm';
import { TAX_TYPES } from '../../types';
import { Wand2 } from 'lucide-react';

interface SectionCProps {
  form: UseFormReturn<FormData>;
  errors?: any;
}

export function SectionC({ form }: SectionCProps) {
  const { register, watch, setValue } = form;
  const taxTypesSelected = watch('taxTypesSelected') || [];

  const fillSampleData = () => {
    setValue('taxTypesSelected', ['Income Tax', 'VAT', 'SSCL']);
    setValue('otherRegistrations', 'BOI registration, Export license, Chamber of Commerce membership');
  };

  const handleTaxTypeChange = (taxType: string, checked: boolean) => {
    if (checked) {
      setValue('taxTypesSelected', [...taxTypesSelected, taxType]);
    } else {
      setValue('taxTypesSelected', taxTypesSelected.filter((t: string) => t !== taxType));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Section C — Tax Profile
            </h2>
            <p className="text-gray-600">
              Please provide information about your tax registrations and compliance
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
        {/* Tax Types */}
        <div className="form-group">
          <label className="label">Registered Tax Types (Optional)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TAX_TYPES.map((taxType) => (
              <label key={taxType} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={taxTypesSelected.includes(taxType)}
                  onChange={(e) => handleTaxTypeChange(taxType, e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-900">{taxType}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Other Registrations */}
        <div className="form-group">
          <label className="label">Other Registrations / Notes (Optional)</label>
          <textarea
            {...register('otherRegistrations')}
            className="input min-h-[100px]"
            placeholder="Please list any other tax registrations, compliance requirements, or relevant notes"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
