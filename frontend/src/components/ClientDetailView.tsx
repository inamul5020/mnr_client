import { ClientIntake } from '../types';
import { X, User, Building, FileText, Shield, CreditCard, Calendar, Phone, Mail, MapPin, Globe, Printer } from 'lucide-react';
import { PrintView } from './PrintView';
import { useState } from 'react';

interface ClientDetailViewProps {
  client: ClientIntake;
  isOpen: boolean;
  onClose: () => void;
}

export function ClientDetailView({ client, isOpen, onClose }: ClientDetailViewProps) {
  const [showPrintView, setShowPrintView] = useState(false);

  if (!isOpen) return null;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'VIP': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'NOT_AVAILABLE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = () => {
    setShowPrintView(true);
  };

  const handleClosePrintView = () => {
    setShowPrintView(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Building className="h-6 w-6 text-primary-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{client.legalName}</h2>
              <p className="text-sm text-gray-500">
                {client.tradeName && `${client.tradeName} • `}
                {client.type} • Created by {client.createdBy}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded-md hover:bg-blue-50"
              title="Print Client Information"
            >
              <Printer className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-md hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-8">
            
            {/* Section A - Organization Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Building className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Organization Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Legal Name</label>
                    <p className="text-gray-900 font-medium">{client.legalName}</p>
                  </div>
                  
                  {client.tradeName && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Trade Name</label>
                      <p className="text-gray-900">{client.tradeName}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <p className="text-gray-900">{client.type}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Owner/Primary Contact</label>
                    <p className="text-gray-900">{client.ownerName}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nature of Business</label>
                    <p className="text-gray-900">{client.natureOfBusiness}</p>
                  </div>
                  
                  {client.industry && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Industry</label>
                      <p className="text-gray-900">{client.industry}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Client Priority</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(client.clientPriority)}`}>
                      {client.clientPriority}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <p className="text-gray-900">{client.address}</p>
                    </div>
                    {(client.city || client.state || client.zipCode) && (
                      <p className="text-gray-600 text-sm mt-1">
                        {[client.city, client.state, client.zipCode].filter(Boolean).join(', ')}
                        {client.country && `, ${client.country}`}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Information</label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{client.phoneMobile}</span>
                        <span className="text-gray-500 text-sm">(Mobile)</span>
                      </div>
                      {client.phoneLand && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{client.phoneLand}</span>
                          <span className="text-gray-500 text-sm">(Landline)</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{client.email}</span>
                      </div>
                      {client.website && (
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">
                            {client.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section B - Services */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Services & Tax Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Services Selected</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {client.servicesSelected.map((service, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Service Frequencies</label>
                    <div className="mt-2">
                      {client.serviceFrequencies && Object.keys(client.serviceFrequencies).length > 0 ? (
                        <div className="space-y-1">
                          {Object.entries(client.serviceFrequencies).map(([service, frequency]) => (
                            <div key={service} className="flex justify-between">
                              <span className="text-sm text-gray-600">{service}:</span>
                              <span className="text-sm font-medium text-gray-900">{frequency}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No frequencies set</p>
                      )}
                    </div>
                  </div>
                  
                  {client.tin && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">TIN</label>
                      <p className="text-gray-900 font-mono">{client.tin}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {client.directTaxSubcategories && client.directTaxSubcategories.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Direct Tax Subcategories</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {client.directTaxSubcategories.map((subcategory: string, index: number) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {subcategory}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {client.incomeTaxTypes && client.incomeTaxTypes.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Income Tax Types</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {client.incomeTaxTypes.map((taxType: string, index: number) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            {taxType}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {client.indirectTaxSubcategories && client.indirectTaxSubcategories.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Indirect Tax Subcategories</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {client.indirectTaxSubcategories.map((subcategory: string, index: number) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            {subcategory}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {client.otherRegistrations && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Other Registrations</label>
                      <p className="text-gray-900">{client.otherRegistrations}</p>
                    </div>
                  )}

                  {/* Tax Return Years Tracking */}
                  {client.taxReturnYears && Object.keys(client.taxReturnYears).length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tax Return Years Submitted</label>
                      <div className="mt-2 space-y-3">
                        {Object.entries(client.taxReturnYears).map(([subcategory, years]) => (
                          <div key={subcategory} className="border border-gray-200 rounded-lg p-3">
                            <h4 className="text-sm font-medium text-gray-800 mb-2">{subcategory}</h4>
                            {years && years.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {years.map(year => (
                                  <span key={year} className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                    {year}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">No years submitted yet</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section C - Company Details */}
            {(client.companySecretary || client.registrationNumber || client.incorporationDate || client.annualRevenue || client.employeeCount) && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Building className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Company Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {client.companySecretary && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Company Secretary</label>
                        <p className="text-gray-900">{client.companySecretary}</p>
                      </div>
                    )}
                    
                    {client.registrationNumber && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Registration Number</label>
                        <p className="text-gray-900 font-mono">{client.registrationNumber}</p>
                      </div>
                    )}
                    
                    {client.incorporationDate && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Incorporation Date</label>
                        <p className="text-gray-900">{formatDate(client.incorporationDate)}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {client.annualRevenue && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Annual Revenue</label>
                        <p className="text-gray-900">${parseFloat(client.annualRevenue.toString()).toLocaleString()}</p>
                      </div>
                    )}
                    
                    {client.employeeCount && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Employee Count</label>
                        <p className="text-gray-900">{client.employeeCount.toString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Section D - RAMIS & Documents */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">RAMIS & Documents</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">RAMIS Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.ramisStatus)}`}>
                      {client.ramisStatus}
                    </span>
                  </div>
                  
                  {client.ramisEmail && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">RAMIS Email</label>
                      <p className="text-gray-900">{client.ramisEmail}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Documents Provided</label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Business Registration</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${client.docsBusinessReg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {client.docsBusinessReg ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Deed Copy</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${client.docsDeed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {client.docsDeed ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Vehicle Registration</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${client.docsVehicleReg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {client.docsVehicleReg ? 'Yes' : 'No'}
                        </span>
                      </div>
                      {client.docsOther1 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Other Document 1</span>
                          <span className="text-sm text-gray-900">{client.docsOther1}</span>
                        </div>
                      )}
                      {client.docsOther2 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Other Document 2</span>
                          <span className="text-sm text-gray-900">{client.docsOther2}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section E - Financial Terms */}
            {(client.creditLimit || client.paymentTerms || client.preferredCurrency || client.complianceNotes) && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <CreditCard className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Financial Terms</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {client.creditLimit && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Credit Limit</label>
                        <p className="text-gray-900">${parseFloat(client.creditLimit.toString()).toLocaleString()}</p>
                      </div>
                    )}
                    
                    {client.paymentTerms && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Payment Terms</label>
                        <p className="text-gray-900">{client.paymentTerms}</p>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Preferred Currency</label>
                      <p className="text-gray-900">{client.preferredCurrency}</p>
                    </div>
                  </div>
                  
                  {client.complianceNotes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Compliance Notes</label>
                      <p className="text-gray-900">{client.complianceNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Related Parties */}
            {client.relatedParties && client.relatedParties.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Related Parties</h3>
                </div>
                
                <div className="space-y-4">
                  {client.relatedParties.map((party, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Name</label>
                          <p className="text-gray-900 font-medium">{party.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Relationship</label>
                          <p className="text-gray-900">{party.relationship}</p>
                        </div>
                        {party.tin && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">TIN</label>
                            <p className="text-gray-900 font-mono">{party.tin}</p>
                          </div>
                        )}
                        {party.email && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <p className="text-gray-900">{party.email}</p>
                          </div>
                        )}
                        {party.phone && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Phone</label>
                            <p className="text-gray-900">{party.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes and Metadata */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
              </div>
              
              <div className="space-y-4">
                {client.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Notes</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{client.notes}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Consent Given</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${client.consent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {client.consent ? 'Yes' : 'No'}
                    </span>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Submitted At</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{formatDate((client as any).submittedAt)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created By</label>
                    <p className="text-gray-900">{client.createdBy || 'Unknown'}</p>
                  </div>
                  
                  {(client as any).deletedBy && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Deleted By</label>
                      <p className="text-red-600">{(client as any).deletedBy}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Close
          </button>
        </div>
      </div>

      {/* Print View Modal */}
      {showPrintView && (
        <PrintView
          client={client}
          isOpen={showPrintView}
          onClose={handleClosePrintView}
        />
      )}
    </div>
  );
}
