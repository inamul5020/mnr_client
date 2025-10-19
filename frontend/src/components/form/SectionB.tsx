import { UseFormReturn } from 'react-hook-form';
import { FormData } from '../../pages/ClientIntakeForm';
import { Wand2 } from 'lucide-react';
import { SERVICES } from '../../types';

interface SectionBProps {
  form: UseFormReturn<FormData>;
  errors: any;
}

export function SectionB({ form, errors }: SectionBProps) {
  const { register, watch, setValue } = form;
  const servicesSelected = watch('servicesSelected') || [];

  const fillSampleData = () => {
    setValue('servicesSelected', ['Direct Tax', 'Indirect Tax', 'HR Services']);
    setValue('serviceFrequency', 'Monthly');
    setValue('tin', '123456789V');
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    if (checked) {
      setValue('servicesSelected', [...servicesSelected, service]);
    } else {
      setValue('servicesSelected', servicesSelected.filter((s: string) => s !== service));
    }
  };

  const isTaxServiceSelected = servicesSelected.includes('Direct Tax') || servicesSelected.includes('Indirect Tax');

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Section B — Services Needed
            </h2>
            <p className="text-gray-600">
              Please select the services you require from MNR Associates
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
        {/* Service Selection */}
        <div className="form-group">
          <label className="label">
            Service Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERVICES.map((service) => (
              <label key={service} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={servicesSelected.includes(service)}
                  onChange={(e) => handleServiceChange(service, e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-900">{service}</span>
              </label>
            ))}
          </div>
          {errors.servicesSelected && (
            <p className="error-message">{errors.servicesSelected.message}</p>
          )}
        </div>

        {/* Service Frequency */}
        <div className="form-group">
          <label className="label">Frequency (Optional)</label>
          <select {...register('serviceFrequency')} className="input">
            <option value="">Select Frequency</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Annual">Annual</option>
            <option value="As Needed">As Needed</option>
          </select>
        </div>

        {/* TIN - Required for tax services */}
        {isTaxServiceSelected && (
          <div className="form-group bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <label className="label">
              TIN (Tax Identification Number) <span className="text-red-500">*</span>
            </label>
            <input
              {...register('tin')}
              className="input"
              placeholder="Enter your TIN number (required for tax services)"
              required
            />
            {errors.tin && (
              <p className="error-message">{errors.tin.message}</p>
            )}
            <p className="text-sm text-yellow-700 mt-1">
              TIN is required when Direct Tax or Indirect Tax services are selected
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
