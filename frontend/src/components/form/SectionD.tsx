import { UseFormReturn } from 'react-hook-form';
import { FormData } from '../../pages/ClientIntakeForm';
import { RelatedParty } from '../../types';
import { RELATIONSHIPS } from '../../types';
import { Plus, Trash2, Wand2 } from 'lucide-react';

interface SectionDProps {
  form: UseFormReturn<FormData>;
  errors: any;
}

export function SectionD({ form, errors }: SectionDProps) {
  const { register, watch, setValue } = form;
  const clientType = watch('type');
  const relatedParties = watch('relatedParties') || [];

  const fillSampleData = () => {
    setValue('companySecretary', 'Jane Doe');
    setValue('registrationNumber', 'PV123456');
    setValue('incorporationDate', '2020-01-15');
    setValue('annualRevenue', 5000000);
    setValue('employeeCount', 150);
    setValue('relatedParties', [
      {
        name: 'John Smith',
        relationship: 'Director',
        tin: '123456789V',
        email: 'john@company.com',
        phone: '+94 77 123 4567'
      },
      {
        name: 'Jane Doe',
        relationship: 'Company Secretary',
        tin: '987654321V',
        email: 'jane@company.com',
        phone: '+94 77 987 6543'
      }
    ]);
  };

  const addRelatedParty = () => {
    const newParty: RelatedParty = {
      name: '',
      relationship: '',
      tin: '',
      email: '',
      phone: ''
    };
    setValue('relatedParties', [...relatedParties, newParty]);
  };

  const removeRelatedParty = (index: number) => {
    const updatedParties = relatedParties.filter((_: any, i: number) => i !== index);
    setValue('relatedParties', updatedParties);
  };

  const updateRelatedParty = (index: number, field: keyof RelatedParty, value: string) => {
    const updatedParties = relatedParties.map((party: RelatedParty, i: number) => 
      i === index ? { ...party, [field]: value } : party
    );
    setValue('relatedParties', updatedParties);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Section D — Secretarial & Related Parties
            </h2>
            <p className="text-gray-600">
              Please provide information about company secretarial details and related parties
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
        {/* Company Secretary - Required for Company type */}
        {clientType === 'COMPANY' && (
          <div className="form-group">
            <label className="label">
              Company Secretary <span className="text-red-500">*</span>
            </label>
            <input
              {...register('companySecretary')}
              className="input"
              placeholder="Enter company secretary name"
            />
            {errors.companySecretary && (
              <p className="error-message">{errors.companySecretary.message}</p>
            )}
          </div>
        )}

        {/* Company Details - Only for Company type */}
        {clientType === 'COMPANY' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Company Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="label">Registration Number (Optional)</label>
                <input
                  {...register('registrationNumber')}
                  className="input"
                  placeholder="Company registration number"
                />
              </div>

              <div className="form-group">
                <label className="label">Incorporation Date (Optional)</label>
                <input
                  {...register('incorporationDate')}
                  type="date"
                  className="input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="label">Annual Revenue (Optional)</label>
                <input
                  {...register('annualRevenue', { valueAsNumber: true })}
                  type="number"
                  className="input"
                  placeholder="Annual revenue in USD"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="label">Employee Count (Optional)</label>
                <input
                  {...register('employeeCount', { valueAsNumber: true })}
                  type="number"
                  className="input"
                  placeholder="Number of employees"
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Related Parties */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Related Parties (Optional)</h3>
            <button
              type="button"
              onClick={addRelatedParty}
              disabled={relatedParties.length >= 4}
              className="btn btn-outline inline-flex items-center px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Party
            </button>
          </div>
          
          <p className="text-sm text-gray-500">
            Add up to 4 related parties (directors, partners, key personnel, etc.)
          </p>

          {relatedParties.map((party: RelatedParty, index: number) => (
            <div key={index} className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Related Party {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeRelatedParty(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">Name *</label>
                  <input
                    value={party.name}
                    onChange={(e) => updateRelatedParty(index, 'name', e.target.value)}
                    className="input"
                    placeholder="Full name"
                  />
                </div>

                <div className="form-group">
                  <label className="label">Relationship *</label>
                  <select
                    value={party.relationship}
                    onChange={(e) => updateRelatedParty(index, 'relationship', e.target.value)}
                    className="input"
                  >
                    <option value="">Select Relationship</option>
                    {RELATIONSHIPS.map((rel) => (
                      <option key={rel} value={rel}>{rel}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="label">TIN (Optional)</label>
                  <input
                    value={party.tin || ''}
                    onChange={(e) => updateRelatedParty(index, 'tin', e.target.value)}
                    className="input"
                    placeholder="Tax identification number"
                  />
                </div>

                <div className="form-group">
                  <label className="label">Email (Optional)</label>
                  <input
                    value={party.email || ''}
                    onChange={(e) => updateRelatedParty(index, 'email', e.target.value)}
                    type="email"
                    className="input"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label className="label">Phone (Optional)</label>
                  <input
                    value={party.phone || ''}
                    onChange={(e) => updateRelatedParty(index, 'phone', e.target.value)}
                    className="input"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
