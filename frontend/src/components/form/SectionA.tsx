import { UseFormReturn } from 'react-hook-form';
import { FormData } from '../../pages/ClientIntakeForm';
import { Wand2 } from 'lucide-react';
import { CLIENT_TYPES, INDUSTRIES } from '../../types';

interface SectionAProps {
  form: UseFormReturn<FormData>;
  errors: any;
}

export function SectionA({ form, errors }: SectionAProps) {
  const { register, setValue, watch } = form;
  const managedBy = watch('managedBy');

  const fillSampleData = () => {
    setValue('legalName', 'Sample Company Ltd');
    setValue('tradeName', 'Sample Co');
    setValue('type', 'COMPANY');
    setValue('managedBy', 'Owner');
    setValue('managedByContactName', 'John Smith');
    setValue('ownerName', 'John Smith');
    setValue('address', '123 Business Street, Colombo 03');
    setValue('city', 'Colombo');
    setValue('state', 'Western Province');
    setValue('zipCode', '00300');
    setValue('country', 'Sri Lanka');
    setValue('phoneMobile', '+94 77 123 4567');
    setValue('phoneLand', '+94 11 234 5678');
    setValue('email', 'john@samplecompany.com');
    setValue('website', 'https://www.samplecompany.com');
    setValue('natureOfBusiness', 'Software development and IT consulting');
    setValue('industry', 'Technology');
    setValue('clientPriority', 'HIGH');
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Section A — Organization Details
            </h2>
            <p className="text-gray-600">
              Please provide basic information about your organization
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
        {/* Legal Name */}
        <div className="form-group">
          <label className="label">
            Legal Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('legalName')}
            className="input"
            placeholder="Enter legal name of the organization"
          />
          {errors.legalName && (
            <p className="error-message">{errors.legalName.message}</p>
          )}
        </div>

        {/* Trade Name */}
        <div className="form-group">
          <label className="label">Business / Trade Name (Optional)</label>
          <input
            {...register('tradeName')}
            className="input"
            placeholder="Enter trade name if different from legal name"
          />
        </div>

        {/* Type */}
        <div className="form-group">
          <label className="label">
            Type <span className="text-red-500">*</span>
          </label>
          <select {...register('type')} className="input">
            {CLIENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="error-message">{errors.type.message}</p>
          )}
        </div>

        {/* Managed By */}
        <div className="form-group">
          <label className="label">Managed By</label>
          <select {...register('managedBy')} className="input">
            <option value="">Select an option</option>
            <option value="Owner">Owner</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Conditional Contact Name Field */}
        {managedBy && (
          <div className="form-group">
            <label className="label">
              {managedBy === 'Owner' ? 'Owner Contact Name' : 'Other Contact Name'}
            </label>
            <input
              {...register('managedByContactName')}
              className="input"
              placeholder={`Enter ${managedBy.toLowerCase()} contact name`}
            />
          </div>
        )}

        {/* Owner / Primary Contact Name */}
        <div className="form-group">
          <label className="label">
            Owner / Primary Contact Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('ownerName')}
            className="input"
            placeholder="Enter full name"
          />
          {errors.ownerName && (
            <p className="error-message">{errors.ownerName.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="form-group">
          <label className="label">
            Business Address <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('address')}
            className="input min-h-[80px]"
            placeholder="Enter complete business address"
            rows={3}
          />
          {errors.address && (
            <p className="error-message">{errors.address.message}</p>
          )}
        </div>

        {/* City, State, ZIP, Country */}
        <div className="form-row-3">
          <div className="form-group">
            <label className="label">City</label>
            <input
              {...register('city')}
              className="input"
              placeholder="City"
            />
          </div>

          <div className="form-group">
            <label className="label">State / Province</label>
            <input
              {...register('state')}
              className="input"
              placeholder="State / Province"
            />
          </div>

          <div className="form-group">
            <label className="label">ZIP / Postal Code</label>
            <input
              {...register('zipCode')}
              className="input"
              placeholder="ZIP / Postal Code"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="label">Country</label>
          <input
            {...register('country')}
            className="input"
            placeholder="Country"
          />
        </div>

        {/* Phone Numbers */}
        <div className="form-row">
          <div className="form-group">
            <label className="label">Phone (Mobile)</label>
            <input
              {...register('phoneMobile')}
              className="input"
              placeholder="Mobile phone number"
            />
            {errors.phoneMobile && (
              <p className="error-message">{errors.phoneMobile.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="label">Phone (Landline) (Optional)</label>
            <input
              {...register('phoneLand')}
              className="input"
              placeholder="Landline phone number"
            />
          </div>
        </div>

        {/* Email and Website */}
        <div className="form-row">
          <div className="form-group">
            <label className="label">Email</label>
            <input
              {...register('email')}
              type="email"
              className="input"
              placeholder="business@example.com"
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="label">Website (Optional)</label>
            <input
              {...register('website')}
              type="url"
              className="input"
              placeholder="https://www.example.com"
            />
          </div>
        </div>

        {/* Nature of Business and Industry */}
        <div className="form-row">
          <div className="form-group">
            <label className="label">Nature of Business</label>
            <textarea
              {...register('natureOfBusiness')}
              className="input min-h-[80px]"
              placeholder="Brief description of your business activities"
              rows={3}
            />
            {errors.natureOfBusiness && (
              <p className="error-message">{errors.natureOfBusiness.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="label">Industry (Optional)</label>
            <select {...register('industry')} className="input">
              <option value="">Select Industry</option>
              {INDUSTRIES.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Client Priority */}
        <div className="form-group">
          <label className="label">Client Priority (Optional)</label>
          <select {...register('clientPriority')} className="input">
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
            <option value="HIGH">High</option>
            <option value="VIP">VIP</option>
          </select>
        </div>
      </div>
    </div>
  );
}
