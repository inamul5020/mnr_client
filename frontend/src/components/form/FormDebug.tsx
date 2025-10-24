import { useFormContext } from 'react-hook-form';
import { FormData } from '../../pages/ClientIntakeForm';

export function FormDebug() {
  const { formState: { errors, isValid }, watch } = useFormContext<FormData>();
  
  const formData = watch();
  
  const validationChecks = [
    {
      name: 'Legal Name',
      valid: !!formData.legalName,
      value: formData.legalName
    },
    {
      name: 'Owner Name',
      valid: !!formData.ownerName,
      value: formData.ownerName
    },
    {
      name: 'Address',
      valid: !!formData.address,
      value: formData.address
    },
    {
      name: 'Services Selected',
      valid: formData.servicesSelected && formData.servicesSelected.length > 0,
      value: formData.servicesSelected?.join(', ') || 'None'
    },
    {
      name: 'Direct Tax Subcategories',
      valid: !formData.servicesSelected?.includes('Direct Tax') || 
             (formData.directTaxSubcategories && formData.directTaxSubcategories.length > 0),
      value: formData.directTaxSubcategories?.join(', ') || 'None',
      required: formData.servicesSelected?.includes('Direct Tax')
    },
    {
      name: 'Indirect Tax Subcategories',
      valid: !formData.servicesSelected?.includes('Indirect Tax') || 
             (formData.indirectTaxSubcategories && formData.indirectTaxSubcategories.length > 0),
      value: formData.indirectTaxSubcategories?.join(', ') || 'None',
      required: formData.servicesSelected?.includes('Indirect Tax')
    },
    {
      name: 'Company Secretary',
      valid: formData.type !== 'COMPANY' || 
             (formData.companySecretary && formData.companySecretary.length > 0),
      value: formData.companySecretary || 'None',
      required: formData.type === 'COMPANY'
    },
    {
      name: 'Consent',
      valid: formData.consent === true,
      value: formData.consent ? 'Yes' : 'No'
    }
  ];

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-medium text-yellow-800 mb-2">Form Validation Debug</h3>
      <div className="text-xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-medium">Overall Valid:</span>
          <span className={`px-2 py-1 rounded text-xs ${isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isValid ? 'YES' : 'NO'}
          </span>
        </div>
        
        {validationChecks.map((check, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className={`${check.required ? 'font-medium' : ''}`}>
              {check.name} {check.required && '*'}
            </span>
            <span className={`px-2 py-1 rounded text-xs ${check.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {check.valid ? '✓' : '✗'}
            </span>
          </div>
        ))}
        
        {Object.keys(errors).length > 0 && (
          <div className="mt-2 pt-2 border-t border-yellow-300">
            <div className="font-medium text-red-800">Errors:</div>
            {Object.entries(errors).map(([field, error]) => {
              const errorMessage = typeof error === 'object' && error && 'message' in error 
                ? (error as any).message 
                : 'Invalid';
              return (
                <div key={field} className="text-red-700">
                  {field}: {errorMessage}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
