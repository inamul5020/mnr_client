import { UseFormReturn } from 'react-hook-form';
import { FormData } from '../../pages/ClientIntakeForm';
import { PAYMENT_TERMS, CURRENCIES } from '../../types';
import { Wand2 } from 'lucide-react';

interface SectionFProps {
  form: UseFormReturn<FormData>;
  errors: any;
}

export function SectionF({ form, errors }: SectionFProps) {
  const { register, setValue } = form;

  const fillSampleData = () => {
    setValue('creditLimit', 100000);
    setValue('paymentTerms', 'Net 30');
    setValue('preferredCurrency', 'USD');
    setValue('notes', 'This is a sample client for testing purposes. All information provided is fictional.');
    setValue('consent', true);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Section F — Financial Terms
            </h2>
            <p className="text-gray-600">
              Please provide financial terms and preferences (optional - can be filled by staff later)
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
        {/* Financial Terms */}
        <div className="form-row">
          <div className="form-group">
            <label className="label">Credit Limit (Optional)</label>
            <input
              {...register('creditLimit', { valueAsNumber: true })}
              type="number"
              className="input"
              placeholder="Credit limit in USD"
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label className="label">Payment Terms (Optional)</label>
            <select {...register('paymentTerms')} className="input">
              <option value="">Select Payment Terms</option>
              {PAYMENT_TERMS.map((term) => (
                <option key={term} value={term}>{term}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="label">Preferred Currency (Optional)</label>
          <select {...register('preferredCurrency')} className="input">
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>

        {/* Additional Notes */}
        <div className="form-group">
          <label className="label">Additional Notes (Optional)</label>
          <textarea
            {...register('notes')}
            className="input min-h-[100px]"
            placeholder="Any additional notes or special requirements"
            rows={4}
          />
        </div>

        {/* Consent */}
        <div className="form-group">
          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <input
              {...register('consent')}
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
            />
            <div className="text-sm">
              <label className="font-medium text-gray-900 cursor-pointer">
                Consent <span className="text-red-500">*</span>
              </label>
              <p className="text-gray-600 mt-1">
                I confirm these details are accurate and authorize MNR Associates to use this information for advisory and tax-related purposes.
              </p>
              {errors.consent && (
                <p className="error-message mt-2">{errors.consent.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Privacy Notice</h4>
          <p className="text-sm text-blue-800">
            We don't collect passwords or OTPs. Files are used only for advisory and tax purposes. 
            Your information is protected and will only be used for legitimate business purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
