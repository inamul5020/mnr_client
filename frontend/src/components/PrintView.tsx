import { ClientIntake } from '../types';
import { useState, useEffect } from 'react';

interface PrintViewProps {
  client: ClientIntake;
  isOpen: boolean;
  onClose: () => void;
}

export function PrintView({ client, isOpen, onClose }: PrintViewProps) {
  const [printMode, setPrintMode] = useState<'compact' | 'standard' | 'detailed'>('compact');
  const [estimatedPages, setEstimatedPages] = useState(2);

  if (!isOpen) return null;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const printDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate content density and estimate pages
  useEffect(() => {
    let contentDensity = 0;
    
    // Count fields with data
    if (client.tradeName) contentDensity++;
    if (client.phoneLand) contentDensity++;
    if (client.website) contentDensity++;
    if (client.industry) contentDensity++;
    if (client.tin) contentDensity++;
    if (client.otherRegistrations) contentDensity++;
    if (client.companySecretary) contentDensity++;
    if (client.registrationNumber) contentDensity++;
    if (client.incorporationDate) contentDensity++;
    if (client.annualRevenue) contentDensity++;
    if (client.employeeCount) contentDensity++;
    if (client.ramisEmail) contentDensity++;
    if (client.complianceNotes) contentDensity++;
    if (client.notes) contentDensity++;
    if (client.relatedParties && client.relatedParties.length > 0) contentDensity += client.relatedParties.length;
    if (client.taxReturnYears && Object.keys(client.taxReturnYears).length > 0) contentDensity += Object.keys(client.taxReturnYears).length;
    
    // Estimate pages based on content density
    if (contentDensity < 10) {
      setEstimatedPages(1);
      setPrintMode('compact');
    } else if (contentDensity < 20) {
      setEstimatedPages(2);
      setPrintMode('standard');
    } else {
      setEstimatedPages(3);
      setPrintMode('detailed');
    }
  }, [client]);

  const handlePrint = () => {
    window.print();
  };

  const getPrintStyles = () => {
    const baseStyles = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-content, .print-content * {
          visibility: visible;
        }
        .print-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        .no-print {
          display: none !important;
        }
      }
    `;

    if (printMode === 'compact') {
      return baseStyles + `
        .print-page {
          page-break-after: avoid;
          min-height: auto;
          padding: 1cm;
          font-family: Arial, sans-serif;
          font-size: 8px;
          line-height: 1.1;
          color: #333;
        }
        
        .print-header {
          text-align: center;
          border-bottom: 1px solid #333;
          padding-bottom: 5px;
          margin-bottom: 8px;
        }
        
        .company-name {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 2px;
          color: #1a365d;
        }
        
        .print-date {
          font-size: 8px;
          color: #666;
          font-style: italic;
        }
        
        .section {
          margin-bottom: 8px;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 10px;
          font-weight: bold;
          background-color: #f8f9fa;
          padding: 3px 6px;
          margin-bottom: 4px;
          border-left: 2px solid #333;
          color: #2d3748;
        }
        
        .field-row {
          display: flex;
          margin-bottom: 2px;
          border-bottom: 1px dotted #e2e8f0;
          padding-bottom: 1px;
        }
        
        .field-label {
          font-weight: bold;
          color: #4a5568;
          width: 25%;
          min-width: 80px;
          font-size: 7px;
        }
        
        .field-value {
          color: #2d3748;
          width: 75%;
          word-wrap: break-word;
          font-size: 7px;
        }
        
        .badges-container {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          margin-top: 2px;
        }
        
        .badge {
          background-color: #e2e8f0;
          padding: 1px 3px;
          border-radius: 6px;
          font-size: 6px;
          border: 1px solid #cbd5e0;
          font-weight: 500;
        }
        
        .four-column {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 8px;
        }
        
        .six-column {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
          gap: 6px;
        }
        
        .footer {
          margin-top: 8px;
          padding-top: 4px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          font-size: 6px;
          color: #718096;
        }
      `;
    } else if (printMode === 'standard') {
      return baseStyles + `
        .print-page {
          page-break-after: always;
          min-height: 29.7cm;
          padding: 1.2cm;
          font-family: Arial, sans-serif;
          font-size: 9px;
          line-height: 1.15;
          color: #333;
        }
        
        .print-page:last-child {
          page-break-after: avoid;
        }
        
        .print-header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 8px;
          margin-bottom: 12px;
        }
        
        .company-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 3px;
          color: #1a365d;
        }
        
        .print-date {
          font-size: 9px;
          color: #666;
          font-style: italic;
        }
        
        .section {
          margin-bottom: 12px;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 11px;
          font-weight: bold;
          background-color: #f8f9fa;
          padding: 4px 8px;
          margin-bottom: 6px;
          border-left: 3px solid #333;
          color: #2d3748;
        }
        
        .field-row {
          display: flex;
          margin-bottom: 3px;
          border-bottom: 1px dotted #e2e8f0;
          padding-bottom: 2px;
        }
        
        .field-label {
          font-weight: bold;
          color: #4a5568;
          width: 30%;
          min-width: 90px;
          font-size: 8px;
        }
        
        .field-value {
          color: #2d3748;
          width: 70%;
          word-wrap: break-word;
          font-size: 8px;
        }
        
        .badges-container {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          margin-top: 2px;
        }
        
        .badge {
          background-color: #e2e8f0;
          padding: 1px 4px;
          border-radius: 6px;
          font-size: 7px;
          border: 1px solid #cbd5e0;
          font-weight: 500;
        }
        
        .three-column {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
        }
        
        .footer {
          margin-top: 12px;
          padding-top: 6px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          font-size: 7px;
          color: #718096;
        }
      `;
    } else {
      // detailed mode - original styles
      return baseStyles + `
        .print-page {
          page-break-after: always;
          min-height: 29.7cm;
          padding: 1.5cm;
          font-family: Arial, sans-serif;
          font-size: 10px;
          line-height: 1.2;
          color: #333;
        }
        
        .print-page:last-child {
          page-break-after: avoid;
        }
        
        .print-header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        
        .company-name {
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 5px;
          color: #1a365d;
        }
        
        .print-date {
          font-size: 10px;
          color: #666;
          font-style: italic;
        }
        
        .section {
          margin-bottom: 15px;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 13px;
          font-weight: bold;
          background-color: #f8f9fa;
          padding: 6px 10px;
          margin-bottom: 8px;
          border-left: 3px solid #333;
          color: #2d3748;
        }
        
        .field-row {
          display: flex;
          margin-bottom: 4px;
          border-bottom: 1px dotted #e2e8f0;
          padding-bottom: 3px;
        }
        
        .field-label {
          font-weight: bold;
          color: #4a5568;
          width: 30%;
          min-width: 100px;
          font-size: 9px;
        }
        
        .field-value {
          color: #2d3748;
          width: 70%;
          word-wrap: break-word;
          font-size: 9px;
        }
        
        .badges-container {
          display: flex;
          flex-wrap: wrap;
          gap: 3px;
          margin-top: 3px;
        }
        
        .badge {
          background-color: #e2e8f0;
          padding: 2px 5px;
          border-radius: 8px;
          font-size: 8px;
          border: 1px solid #cbd5e0;
          font-weight: 500;
        }
        
        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .three-column {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
        }
        
        .footer {
          margin-top: 15px;
          padding-top: 8px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          font-size: 8px;
          color: #718096;
        }
      `;
    }
  };

  const renderCompactLayout = () => (
    <div className="print-page">
      <div className="print-header">
        <div className="company-name">{client.legalName}</div>
        <div className="print-date">Client Information Report - {printDate}</div>
      </div>

      {/* Organization Details - Compact */}
      <div className="section">
        <div className="section-title">Organization Details</div>
        <div className="six-column">
          <div className="field-row">
            <div className="field-label">Legal Name:</div>
            <div className="field-value">{client.legalName}</div>
          </div>
          <div className="field-row">
            <div className="field-label">Type:</div>
            <div className="field-value">{client.type}</div>
          </div>
          <div className="field-row">
            <div className="field-label">Managed By:</div>
            <div className="field-value">{client.managedBy || 'N/A'}</div>
          </div>
          <div className="field-row">
            <div className="field-label">Managed By Contact:</div>
            <div className="field-value">{client.managedByContactName || 'N/A'}</div>
          </div>
          <div className="field-row">
            <div className="field-label">Owner:</div>
            <div className="field-value">{client.ownerName}</div>
          </div>
          <div className="field-row">
            <div className="field-label">Mobile:</div>
            <div className="field-value">{client.phoneMobile}</div>
          </div>
          <div className="field-row">
            <div className="field-label">Email:</div>
            <div className="field-value">{client.email}</div>
          </div>
          <div className="field-row">
            <div className="field-label">Business:</div>
            <div className="field-value">{client.natureOfBusiness}</div>
          </div>
        </div>
        <div className="field-row">
          <div className="field-label">Address:</div>
          <div className="field-value">{client.address}, {client.city || ''}, {client.state || ''}, {client.zipCode || ''}, {client.country || ''}</div>
        </div>
      </div>

      {/* Services & Tax - Compact */}
      <div className="section">
        <div className="section-title">Services & Tax Profile</div>
        <div className="four-column">
          <div className="field-row">
            <div className="field-label">Services:</div>
            <div className="field-value">
              <div className="badges-container">
                {client.servicesSelected?.map(service => (
                  <span key={service} className="badge">{service}</span>
                )) || <span className="no-data">None</span>}
              </div>
            </div>
          </div>
          {client.tin && (
            <div className="field-row">
              <div className="field-label">TIN:</div>
              <div className="field-value">{client.tin}</div>
            </div>
          )}
          <div className="field-row">
            <div className="field-label">RAMIS:</div>
            <div className="field-value">{client.ramisStatus}</div>
          </div>
          <div className="field-row">
            <div className="field-label">Priority:</div>
            <div className="field-value">
              <span className={`badge ${client.clientPriority === 'HIGH' ? 'badge-red' : client.clientPriority === 'MEDIUM' ? 'badge-yellow' : client.clientPriority === 'LOW' ? 'badge-green' : client.clientPriority === 'VIP' ? 'badge-purple' : ''}`}>
                {client.clientPriority || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Company Details - Compact */}
      {client.type === 'COMPANY' && (
        <div className="section">
          <div className="section-title">Company Details</div>
          <div className="four-column">
            {client.companySecretary && (
              <div className="field-row">
                <div className="field-label">Secretary:</div>
                <div className="field-value">{client.companySecretary}</div>
              </div>
            )}
            {client.registrationNumber && (
              <div className="field-row">
                <div className="field-label">Reg. No:</div>
                <div className="field-value">{client.registrationNumber}</div>
              </div>
            )}
            {client.annualRevenue && (
              <div className="field-row">
                <div className="field-label">Revenue:</div>
                <div className="field-value">${client.annualRevenue.toLocaleString()}</div>
              </div>
            )}
            {client.employeeCount && (
              <div className="field-row">
                <div className="field-label">Employees:</div>
                <div className="field-value">{client.employeeCount}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Related Parties - Compact */}
      {client.relatedParties && client.relatedParties.length > 0 && (
        <div className="section">
          <div className="section-title">Related Parties</div>
          <div className="four-column">
            {client.relatedParties.slice(0, 4).map((party, index) => (
              <div key={index} className="field-row">
                <div className="field-label">Party {index + 1}:</div>
                <div className="field-value">
                  <div><strong>{party.name}</strong> ({party.relationship})</div>
                  <div className="no-data">{party.email || 'N/A'} | {party.phone || 'N/A'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes - Compact */}
      {client.notes && (
        <div className="section">
          <div className="section-title">Notes</div>
          <div className="field-row">
            <div className="field-value">{client.notes}</div>
          </div>
        </div>
      )}

      <div className="footer">
        Single Page - MNR Client Management System | Generated on {printDate}
      </div>
    </div>
  );

  const renderStandardLayout = () => (
    <>
      {/* Page 1 - Organization & Services */}
      <div className="print-page">
        <div className="print-header">
          <div className="company-name">{client.legalName}</div>
          <div className="print-date">Client Information Report - Printed on: {printDate}</div>
        </div>

        {/* Organization Details */}
        <div className="section">
          <div className="section-title">Organization Details</div>
          <div className="three-column">
            <div className="field-row">
              <div className="field-label">Legal Name:</div>
              <div className="field-value">{client.legalName}</div>
            </div>
            <div className="field-row">
              <div className="field-label">Trade Name:</div>
              <div className="field-value">{client.tradeName || 'N/A'}</div>
            </div>
            <div className="field-row">
              <div className="field-label">Type:</div>
              <div className="field-value">{client.type}</div>
            </div>
            <div className="field-row">
              <div className="field-label">Owner:</div>
              <div className="field-value">{client.ownerName}</div>
            </div>
            <div className="field-row">
              <div className="field-label">Mobile:</div>
              <div className="field-value">{client.phoneMobile}</div>
            </div>
            <div className="field-row">
              <div className="field-label">Land:</div>
              <div className="field-value">{client.phoneLand || 'N/A'}</div>
            </div>
            <div className="field-row">
              <div className="field-label">Email:</div>
              <div className="field-value">{client.email}</div>
            </div>
            <div className="field-row">
              <div className="field-label">Website:</div>
              <div className="field-value">{client.website || 'N/A'}</div>
            </div>
            <div className="field-row">
              <div className="field-label">Priority:</div>
              <div className="field-value">
                <span className={`badge ${client.clientPriority === 'HIGH' ? 'badge-red' : client.clientPriority === 'MEDIUM' ? 'badge-yellow' : client.clientPriority === 'LOW' ? 'badge-green' : client.clientPriority === 'VIP' ? 'badge-purple' : ''}`}>
                  {client.clientPriority || 'N/A'}
                </span>
              </div>
            </div>
            <div className="field-row full-width">
              <div className="field-label">Address:</div>
              <div className="field-value">{client.address}, {client.city || ''}, {client.state || ''}, {client.zipCode || ''}, {client.country || ''}</div>
            </div>
            <div className="field-row">
              <div className="field-label">Business:</div>
              <div className="field-value">{client.natureOfBusiness}</div>
            </div>
            <div className="field-row">
              <div className="field-label">Industry:</div>
              <div className="field-value">{client.industry || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Services & Tax Profile */}
        <div className="section">
          <div className="section-title">Services & Tax Profile</div>
          
          <div className="two-column">
            <div className="field-row">
              <div className="field-label">Services:</div>
              <div className="field-value">
                <div className="badges-container">
                  {client.servicesSelected?.map(service => (
                    <span key={service} className="badge">{service}</span>
                  )) || <span className="no-data">None</span>}
                </div>
              </div>
            </div>
            
            {client.tin && (
              <div className="field-row">
                <div className="field-label">TIN:</div>
                <div className="field-value">{client.tin}</div>
              </div>
            )}
          </div>

          {((client.directTaxSubcategories && client.directTaxSubcategories.length > 0) || 
            (client.indirectTaxSubcategories && client.indirectTaxSubcategories.length > 0) || 
            (client.incomeTaxTypes && client.incomeTaxTypes.length > 0)) && (
            <div className="field-row full-width">
              <div className="field-label">Tax Categories:</div>
              <div className="field-value">
                <div className="badges-container">
                  {client.directTaxSubcategories?.map(subcategory => (
                    <span key={subcategory} className="badge badge-blue">{subcategory}</span>
                  ))}
                  {client.incomeTaxTypes?.map(taxType => (
                    <span key={taxType} className="badge badge-purple">{taxType}</span>
                  ))}
                  {client.indirectTaxSubcategories?.map(subcategory => (
                    <span key={subcategory} className="badge badge-green">{subcategory}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {client.serviceFrequencies && Object.keys(client.serviceFrequencies).length > 0 && (
            <div className="field-row full-width">
              <div className="field-label">Frequencies:</div>
              <div className="field-value">
                {Object.entries(client.serviceFrequencies).map(([service, frequency]) => (
                  <span key={service} className="badge badge-yellow">{service}: {frequency}</span>
                ))}
              </div>
            </div>
          )}

          {client.otherRegistrations && (
            <div className="field-row full-width">
              <div className="field-label">Other Registrations:</div>
              <div className="field-value">{client.otherRegistrations}</div>
            </div>
          )}
        </div>

        <div className="footer">
          Page 1 of 2 - MNR Client Management System
        </div>
      </div>

      {/* Page 2 - Company Details & Additional Info */}
      <div className="print-page">
        <div className="print-header">
          <div className="company-name">{client.legalName}</div>
          <div className="print-date">Additional Information - {printDate}</div>
        </div>

        {/* Tax Return Years */}
        {client.taxReturnYears && Object.keys(client.taxReturnYears).length > 0 && (
          <div className="section">
            <div className="section-title">Tax Return Years Submitted</div>
            {Object.entries(client.taxReturnYears).map(([subcategory, years]) => (
              <div key={subcategory} className="tax-years-section">
                <div className="tax-year-title">{subcategory}</div>
                {years && years.length > 0 ? (
                  <div className="year-badges">
                    {years.map(year => (
                      <span key={year} className="year-badge">{year}</span>
                    ))}
                  </div>
                ) : (
                  <span className="no-data">No years submitted yet</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Company Details */}
        {client.type === 'COMPANY' && (
          <div className="section">
            <div className="section-title">Company Details</div>
            <div className="two-column">
              <div className="field-row">
                <div className="field-label">Company Secretary:</div>
                <div className="field-value">{client.companySecretary || 'N/A'}</div>
              </div>
              <div className="field-row">
                <div className="field-label">Registration Number:</div>
                <div className="field-value">{client.registrationNumber || 'N/A'}</div>
              </div>
              <div className="field-row">
                <div className="field-label">Incorporation Date:</div>
                <div className="field-value">{client.incorporationDate ? formatDate(client.incorporationDate) : 'N/A'}</div>
              </div>
              <div className="field-row">
                <div className="field-label">Annual Revenue:</div>
                <div className="field-value">{client.annualRevenue ? `$${client.annualRevenue.toLocaleString()}` : 'N/A'}</div>
              </div>
              <div className="field-row">
                <div className="field-label">Employee Count:</div>
                <div className="field-value">{client.employeeCount || 'N/A'}</div>
              </div>
            </div>
          </div>
        )}

        {/* RAMIS & Documents */}
        <div className="section">
          <div className="section-title">RAMIS & Documents</div>
          <div className="two-column">
            <div className="field-row">
              <div className="field-label">RAMIS Status:</div>
              <div className="field-value">{client.ramisStatus}</div>
            </div>
            <div className="field-row">
              <div className="field-label">RAMIS Email:</div>
              <div className="field-value">{client.ramisEmail || 'N/A'}</div>
            </div>
            <div className="field-row full-width">
              <div className="field-label">Documents Available:</div>
              <div className="field-value">
                <div className="badges-container">
                  {client.docsBusinessReg && <span className="badge badge-green">Business Registration</span>}
                  {client.docsDeed && <span className="badge badge-green">Deed</span>}
                  {client.docsVehicleReg && <span className="badge badge-green">Vehicle Registration</span>}
                  {client.docsOther1 && <span className="badge badge-green">{client.docsOther1}</span>}
                  {client.docsOther2 && <span className="badge badge-green">{client.docsOther2}</span>}
                </div>
              </div>
            </div>
            {client.complianceNotes && (
              <div className="field-row full-width">
                <div className="field-label">Compliance Notes:</div>
                <div className="field-value">{client.complianceNotes}</div>
              </div>
            )}
          </div>
        </div>

        {/* Related Parties */}
        {client.relatedParties && client.relatedParties.length > 0 && (
          <div className="section">
            <div className="section-title">Related Parties</div>
            <div className="two-column">
              {client.relatedParties.map((party, index) => (
                <div key={index} className="field-row">
                  <div className="field-label">Party {index + 1}:</div>
                  <div className="field-value">
                    <div><strong>{party.name}</strong> ({party.relationship})</div>
                    <div className="no-data">
                      {party.email || 'N/A'} | {party.phone || 'N/A'}
                      {party.tin && ` | TIN: ${party.tin}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="section">
          <div className="section-title">Additional Information</div>
          <div className="notes-section">
            <div className="field-row full-width">
              <div className="field-label">Notes:</div>
              <div className="field-value">{client.notes || 'No additional notes'}</div>
            </div>
            <div className="two-column">
              <div className="field-row">
                <div className="field-label">Created By:</div>
                <div className="field-value">{client.createdBy || 'N/A'}</div>
              </div>
              <div className="field-row">
                <div className="field-label">Consent:</div>
                <div className="field-value">{client.consent ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer">
          Page 2 of 2 - MNR Client Management System | Generated on {printDate}
        </div>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Print Preview - {client.legalName}</h2>
              <p className="text-sm text-gray-500">
                {printMode === 'compact' ? 'Compact Layout (1 page)' : 
                 printMode === 'standard' ? 'Standard Layout (2 pages)' : 
                 'Detailed Layout (3+ pages)'} - Estimated {estimatedPages} page{estimatedPages > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={printMode}
              onChange={(e) => setPrintMode(e.target.value as 'compact' | 'standard' | 'detailed')}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="compact">Compact (1 page)</option>
              <option value="standard">Standard (2 pages)</option>
              <option value="detailed">Detailed (3+ pages)</option>
            </select>
            <button
              onClick={handlePrint}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-md hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Print Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-8 print-content">
            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{
              __html: getPrintStyles() + `
                .badge-blue { background-color: #bee3f8; color: #2b6cb0; border-color: #90cdf4; }
                .badge-green { background-color: #c6f6d5; color: #276749; border-color: #9ae6b4; }
                .badge-purple { background-color: #e9d8fd; color: #553c9a; border-color: #d6bcfa; }
                .badge-yellow { background-color: #faf089; color: #744210; border-color: #f6e05e; }
                .badge-red { background-color: #fed7d7; color: #c53030; border-color: #fc8181; }
                
                .tax-years-section {
                  margin-top: 8px;
                  padding: 8px;
                  border: 1px solid #e2e8f0;
                  border-radius: 4px;
                  background-color: #f7fafc;
                }
                
                .tax-year-title {
                  font-weight: bold;
                  margin-bottom: 5px;
                  color: #4a5568;
                  font-size: 9px;
                }
                
                .year-badges {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 2px;
                }
                
                .year-badge {
                  background-color: #c6f6d5;
                  color: #276749;
                  padding: 1px 4px;
                  border-radius: 6px;
                  font-size: 7px;
                  font-weight: 500;
                }
                
                .no-data {
                  color: #a0aec0;
                  font-style: italic;
                  font-size: 8px;
                }
                
                .full-width {
                  grid-column: 1 / -1;
                }
                
                .notes-section {
                  background-color: #f7fafc;
                  padding: 8px;
                  border-radius: 4px;
                  border-left: 3px solid #4299e1;
                }
              `
            }} />

            {printMode === 'compact' ? renderCompactLayout() : renderStandardLayout()}
          </div>
        </div>
      </div>
    </div>
  );
}