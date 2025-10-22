import { UseFormReturn } from 'react-hook-form';
import { FormData } from '../../pages/ClientIntakeForm';
import { Wand2 } from 'lucide-react';
import { 
  SERVICES, 
  DIRECT_TAX_SUBCATEGORIES, 
  INDIRECT_TAX_SUBCATEGORIES, 
  INCOME_TAX_TYPES,
  FREQUENCY_OPTIONS
} from '../../types';

interface SectionBProps {
  form: UseFormReturn<FormData>;
  errors: any;
}

export function SectionB({ form, errors }: SectionBProps) {
  const { register, watch, setValue } = form;
  const servicesSelected = watch('servicesSelected') || [];
  const directTaxSubcategories = watch('directTaxSubcategories') || [];
  const indirectTaxSubcategories = watch('indirectTaxSubcategories') || [];
  const incomeTaxTypes = watch('incomeTaxTypes') || [];
  const serviceFrequencies = watch('serviceFrequencies') || {};

  const fillSampleData = () => {
    setValue('servicesSelected', ['Direct Tax', 'Indirect Tax', 'Accounts']);
    setValue('directTaxSubcategories', ['Income Taxes', 'Capital Gain Tax']);
    setValue('indirectTaxSubcategories', ['VAT', 'SSCL']);
    setValue('incomeTaxTypes', ['CIT', 'PIT']);
    setValue('tin', '123456789V');
    setValue('otherRegistrations', 'BOI registration, Export license');
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    if (checked) {
      setValue('servicesSelected', [...servicesSelected, service]);
    } else {
      setValue('servicesSelected', servicesSelected.filter((s: string) => s !== service));
      // Clear subcategories when service is unchecked
      if (service === 'Direct Tax') {
        setValue('directTaxSubcategories', []);
      } else if (service === 'Indirect Tax') {
        setValue('indirectTaxSubcategories', []);
      }
    }
  };

  const handleSubcategoryChange = (category: 'direct' | 'indirect', subcategory: string, checked: boolean) => {
    if (category === 'direct') {
      if (checked) {
        setValue('directTaxSubcategories', [...directTaxSubcategories, subcategory]);
      } else {
        setValue('directTaxSubcategories', directTaxSubcategories.filter((s: string) => s !== subcategory));
      }
    } else {
      if (checked) {
        setValue('indirectTaxSubcategories', [...indirectTaxSubcategories, subcategory]);
      } else {
        setValue('indirectTaxSubcategories', indirectTaxSubcategories.filter((s: string) => s !== subcategory));
      }
    }
  };

  const handleFrequencyChange = (key: string, frequency: string) => {
    setValue('serviceFrequencies', { ...serviceFrequencies, [key]: frequency });
  };

  const handleIncomeTaxTypeChange = (taxType: string, checked: boolean) => {
    if (checked) {
      setValue('incomeTaxTypes', [...incomeTaxTypes, taxType]);
    } else {
      setValue('incomeTaxTypes', incomeTaxTypes.filter((t: string) => t !== taxType));
    }
  };

  // Tax year functionality will be implemented in admin dashboard

  const isTaxServiceSelected = servicesSelected.includes('Direct Tax') || servicesSelected.includes('Indirect Tax');

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Section B — Services & Tax Profile
            </h2>
            <p className="text-gray-600">
              Please select the services you require and provide tax profile information
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

        {/* Direct Tax Subcategories */}
        {servicesSelected.includes('Direct Tax') && (
          <div className="form-group bg-blue-50 p-4 rounded-lg border border-blue-200">
            <label className="label">
              Direct Tax Subcategories <span className="text-red-500">*</span>
            </label>
            <div className="space-y-4">
              {DIRECT_TAX_SUBCATEGORIES.map((subcategory) => (
                <div key={subcategory} className="border border-gray-200 rounded-lg p-4">
                  <label className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      checked={directTaxSubcategories.includes(subcategory)}
                      onChange={(e) => handleSubcategoryChange('direct', subcategory, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-900">{subcategory}</span>
                  </label>
                  
                  {/* Income Tax Types for Income Taxes subcategory */}
                  {subcategory === 'Income Taxes' && directTaxSubcategories.includes('Income Taxes') && (
                    <div className="ml-7 space-y-2">
                      <p className="text-xs text-gray-600">Select Income Tax Types:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {INCOME_TAX_TYPES.map((taxType) => (
                          <label key={taxType} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={incomeTaxTypes.includes(taxType)}
                              onChange={(e) => handleIncomeTaxTypeChange(taxType, e.target.checked)}
                              className="h-3 w-3 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span className="text-xs text-gray-700">{taxType}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {errors.directTaxSubcategories && (
              <p className="error-message">{errors.directTaxSubcategories.message}</p>
            )}
          </div>
        )}

        {/* Indirect Tax Subcategories */}
        {servicesSelected.includes('Indirect Tax') && (
          <div className="form-group bg-green-50 p-4 rounded-lg border border-green-200">
            <label className="label">
              Indirect Tax Subcategories <span className="text-red-500">*</span>
            </label>
            <div className="space-y-4">
              {INDIRECT_TAX_SUBCATEGORIES.map((subcategory) => (
                <div key={subcategory} className="border border-gray-200 rounded-lg p-4">
                  <label className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      checked={indirectTaxSubcategories.includes(subcategory)}
                      onChange={(e) => handleSubcategoryChange('indirect', subcategory, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-900">{subcategory}</span>
                  </label>
                </div>
              ))}
            </div>
            {errors.indirectTaxSubcategories && (
              <p className="error-message">{errors.indirectTaxSubcategories.message}</p>
            )}
          </div>
        )}


        {/* TIN - Required for tax services */}
        {isTaxServiceSelected && (
          <div className="form-group bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <label className="label">TIN (Tax Identification Number)</label>
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

        {/* Other Registrations / Notes */}
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
