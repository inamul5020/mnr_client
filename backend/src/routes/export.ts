import express from 'express';
import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import * as createCsvWriter from 'csv-writer';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/export/excel/:id - Export single client to Excel
router.get('/excel/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const clientIntake = await prisma.clientIntake.findUnique({
      where: { id },
      include: {
        relatedParties: true
      }
    });

    if (!clientIntake) {
      return res.status(404).json({ error: 'Client intake not found' });
    }

    const workbook = new ExcelJS.Workbook();
    
    // Sheet 1: Client Details
    const clientSheet = workbook.addWorksheet('Client Details');
    
    // Add headers and data
    clientSheet.columns = [
      { header: 'Field', key: 'field', width: 25 },
      { header: 'Value', key: 'value', width: 40 }
    ];

    // Section A - Organization Details
    clientSheet.addRow({ field: 'LEGAL NAME', value: clientIntake.legalName });
    clientSheet.addRow({ field: 'Trade Name', value: clientIntake.tradeName || '' });
    clientSheet.addRow({ field: 'Type', value: clientIntake.type });
    clientSheet.addRow({ field: 'Owner/Primary Contact', value: clientIntake.ownerName });
    clientSheet.addRow({ field: 'Address', value: clientIntake.address });
    clientSheet.addRow({ field: 'City', value: clientIntake.city || '' });
    clientSheet.addRow({ field: 'State', value: clientIntake.state || '' });
    clientSheet.addRow({ field: 'ZIP Code', value: clientIntake.zipCode || '' });
    clientSheet.addRow({ field: 'Country', value: clientIntake.country || '' });
    clientSheet.addRow({ field: 'Mobile Phone', value: clientIntake.phoneMobile });
    clientSheet.addRow({ field: 'Landline Phone', value: clientIntake.phoneLand || '' });
    clientSheet.addRow({ field: 'Email', value: clientIntake.email });
    clientSheet.addRow({ field: 'Website', value: clientIntake.website || '' });
    clientSheet.addRow({ field: 'Nature of Business', value: clientIntake.natureOfBusiness });
    clientSheet.addRow({ field: 'Industry', value: clientIntake.industry || '' });
    clientSheet.addRow({ field: 'Client Priority', value: clientIntake.clientPriority });

    // Section B - Services
    clientSheet.addRow({ field: 'Services Selected', value: clientIntake.servicesSelected.join(', ') });
    clientSheet.addRow({ field: 'Service Frequency', value: clientIntake.serviceFrequency || '' });
    clientSheet.addRow({ field: 'TIN', value: clientIntake.tin || '' });

    // Section C - Tax Profile
    clientSheet.addRow({ field: 'Tax Types Selected', value: clientIntake.taxTypesSelected.join(', ') });
    clientSheet.addRow({ field: 'Other Registrations', value: clientIntake.otherRegistrations || '' });

    // Section D - Company Details
    clientSheet.addRow({ field: 'Company Secretary', value: clientIntake.companySecretary || '' });
    clientSheet.addRow({ field: 'Registration Number', value: clientIntake.registrationNumber || '' });
    clientSheet.addRow({ field: 'Incorporation Date', value: clientIntake.incorporationDate?.toLocaleDateString() || '' });
    clientSheet.addRow({ field: 'Annual Revenue', value: clientIntake.annualRevenue?.toString() || '' });
    clientSheet.addRow({ field: 'Employee Count', value: clientIntake.employeeCount?.toString() || '' });

    // Section E - RAMIS & Documents
    clientSheet.addRow({ field: 'RAMIS Status', value: clientIntake.ramisStatus });
    clientSheet.addRow({ field: 'RAMIS Email', value: clientIntake.ramisEmail || '' });
    clientSheet.addRow({ field: 'Business Registration', value: clientIntake.docsBusinessReg ? 'Yes' : 'No' });
    clientSheet.addRow({ field: 'Deed Copy', value: clientIntake.docsDeed ? 'Yes' : 'No' });
    clientSheet.addRow({ field: 'Vehicle Registration', value: clientIntake.docsVehicleReg ? 'Yes' : 'No' });
    clientSheet.addRow({ field: 'Other Document 1', value: clientIntake.docsOther1 || '' });
    clientSheet.addRow({ field: 'Other Document 2', value: clientIntake.docsOther2 || '' });
    clientSheet.addRow({ field: 'Compliance Notes', value: clientIntake.complianceNotes || '' });

    // Section F - Financial Terms
    clientSheet.addRow({ field: 'Credit Limit', value: clientIntake.creditLimit?.toString() || '' });
    clientSheet.addRow({ field: 'Payment Terms', value: clientIntake.paymentTerms || '' });
    clientSheet.addRow({ field: 'Preferred Currency', value: clientIntake.preferredCurrency || '' });

    // Metadata
    clientSheet.addRow({ field: 'Notes', value: clientIntake.notes || '' });
    clientSheet.addRow({ field: 'Consent Given', value: clientIntake.consent ? 'Yes' : 'No' });
    clientSheet.addRow({ field: 'Submitted At', value: clientIntake.submittedAt.toLocaleString() });
    clientSheet.addRow({ field: 'Created By', value: clientIntake.createdBy || '' });

    // Style the header row
    clientSheet.getRow(1).font = { bold: true };
    clientSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    };

    // Sheet 2: Related Parties
    if (clientIntake.relatedParties.length > 0) {
      const partiesSheet = workbook.addWorksheet('Related Parties');
      
      partiesSheet.columns = [
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Relationship', key: 'relationship', width: 20 },
        { header: 'TIN', key: 'tin', width: 15 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Phone', key: 'phone', width: 20 }
      ];

      clientIntake.relatedParties.forEach(party => {
        partiesSheet.addRow({
          name: party.name,
          relationship: party.relationship,
          tin: party.tin || '',
          email: party.email || '',
          phone: party.phone || ''
        });
      });

      // Style the header row
      partiesSheet.getRow(1).font = { bold: true };
      partiesSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6FA' }
      };
    }

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="client-intake-${clientIntake.legalName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx"`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error exporting to Excel:', error);
    res.status(500).json({ 
      error: 'Failed to export to Excel',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/export/excel/all - Export all clients to Excel
router.get('/excel/all', async (req, res) => {
  try {
    const clientIntakes = await prisma.clientIntake.findMany({
      include: {
        relatedParties: true
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('All Client Intakes');

    // Headers
    sheet.columns = [
      { header: 'Legal Name', key: 'legalName', width: 25 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Owner', key: 'ownerName', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phoneMobile', width: 20 },
      { header: 'Services', key: 'servicesSelected', width: 30 },
      { header: 'TIN', key: 'tin', width: 15 },
      { header: 'RAMIS', key: 'ramisStatus', width: 15 },
      { header: 'Submitted', key: 'submittedAt', width: 20 }
    ];

    // Add data rows
    clientIntakes.forEach(client => {
      sheet.addRow({
        legalName: client.legalName,
        type: client.type,
        ownerName: client.ownerName,
        email: client.email,
        phoneMobile: client.phoneMobile,
        servicesSelected: client.servicesSelected.join(', '),
        tin: client.tin || '',
        ramisStatus: client.ramisStatus,
        submittedAt: client.submittedAt.toLocaleDateString()
      });
    });

    // Style the header row
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="all-client-intakes-${new Date().toISOString().split('T')[0]}.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error exporting all to Excel:', error);
    res.status(500).json({ 
      error: 'Failed to export all to Excel',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/export/csv/:id - Export single client to CSV
router.get('/csv/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const clientIntake = await prisma.clientIntake.findUnique({
      where: { id },
      include: {
        relatedParties: true
      }
    });

    if (!clientIntake) {
      return res.status(404).json({ error: 'Client intake not found' });
    }

    // Flatten related parties data
    const relatedPartiesData = clientIntake.relatedParties.map((party, index) => ({
      [`related_party_${index + 1}_name`]: party.name,
      [`related_party_${index + 1}_relationship`]: party.relationship,
      [`related_party_${index + 1}_tin`]: party.tin || '',
      [`related_party_${index + 1}_email`]: party.email || '',
      [`related_party_${index + 1}_phone`]: party.phone || ''
    })).reduce((acc, curr) => ({ ...acc, ...curr }), {});

    const csvWriter = createCsvWriter.createObjectCsvWriter({
      path: 'temp-client-export.csv',
      header: [
        { id: 'legalName', title: 'Legal Name' },
        { id: 'tradeName', title: 'Trade Name' },
        { id: 'type', title: 'Type' },
        { id: 'ownerName', title: 'Owner Name' },
        { id: 'address', title: 'Address' },
        { id: 'city', title: 'City' },
        { id: 'state', title: 'State' },
        { id: 'zipCode', title: 'ZIP Code' },
        { id: 'country', title: 'Country' },
        { id: 'phoneMobile', title: 'Mobile Phone' },
        { id: 'phoneLand', title: 'Landline Phone' },
        { id: 'email', title: 'Email' },
        { id: 'website', title: 'Website' },
        { id: 'natureOfBusiness', title: 'Nature of Business' },
        { id: 'industry', title: 'Industry' },
        { id: 'clientPriority', title: 'Client Priority' },
        { id: 'servicesSelected', title: 'Services Selected' },
        { id: 'serviceFrequency', title: 'Service Frequency' },
        { id: 'tin', title: 'TIN' },
        { id: 'taxTypesSelected', title: 'Tax Types Selected' },
        { id: 'otherRegistrations', title: 'Other Registrations' },
        { id: 'companySecretary', title: 'Company Secretary' },
        { id: 'registrationNumber', title: 'Registration Number' },
        { id: 'incorporationDate', title: 'Incorporation Date' },
        { id: 'annualRevenue', title: 'Annual Revenue' },
        { id: 'employeeCount', title: 'Employee Count' },
        { id: 'ramisStatus', title: 'RAMIS Status' },
        { id: 'ramisEmail', title: 'RAMIS Email' },
        { id: 'docsBusinessReg', title: 'Business Registration' },
        { id: 'docsDeed', title: 'Deed Copy' },
        { id: 'docsVehicleReg', title: 'Vehicle Registration' },
        { id: 'docsOther1', title: 'Other Document 1' },
        { id: 'docsOther2', title: 'Other Document 2' },
        { id: 'complianceNotes', title: 'Compliance Notes' },
        { id: 'creditLimit', title: 'Credit Limit' },
        { id: 'paymentTerms', title: 'Payment Terms' },
        { id: 'preferredCurrency', title: 'Preferred Currency' },
        { id: 'notes', title: 'Notes' },
        { id: 'consent', title: 'Consent Given' },
        { id: 'submittedAt', title: 'Submitted At' },
        { id: 'createdBy', title: 'Created By' },
        // Related parties headers
        { id: 'related_party_1_name', title: 'Related Party 1 Name' },
        { id: 'related_party_1_relationship', title: 'Related Party 1 Relationship' },
        { id: 'related_party_1_tin', title: 'Related Party 1 TIN' },
        { id: 'related_party_1_email', title: 'Related Party 1 Email' },
        { id: 'related_party_1_phone', title: 'Related Party 1 Phone' },
        { id: 'related_party_2_name', title: 'Related Party 2 Name' },
        { id: 'related_party_2_relationship', title: 'Related Party 2 Relationship' },
        { id: 'related_party_2_tin', title: 'Related Party 2 TIN' },
        { id: 'related_party_2_email', title: 'Related Party 2 Email' },
        { id: 'related_party_2_phone', title: 'Related Party 2 Phone' },
        { id: 'related_party_3_name', title: 'Related Party 3 Name' },
        { id: 'related_party_3_relationship', title: 'Related Party 3 Relationship' },
        { id: 'related_party_3_tin', title: 'Related Party 3 TIN' },
        { id: 'related_party_3_email', title: 'Related Party 3 Email' },
        { id: 'related_party_3_phone', title: 'Related Party 3 Phone' },
        { id: 'related_party_4_name', title: 'Related Party 4 Name' },
        { id: 'related_party_4_relationship', title: 'Related Party 4 Relationship' },
        { id: 'related_party_4_tin', title: 'Related Party 4 TIN' },
        { id: 'related_party_4_email', title: 'Related Party 4 Email' },
        { id: 'related_party_4_phone', title: 'Related Party 4 Phone' }
      ]
    });

    const csvData = {
      ...clientIntake,
      servicesSelected: clientIntake.servicesSelected.join(', '),
      taxTypesSelected: clientIntake.taxTypesSelected.join(', '),
      incorporationDate: clientIntake.incorporationDate?.toLocaleDateString() || '',
      submittedAt: clientIntake.submittedAt.toLocaleString(),
      docsBusinessReg: clientIntake.docsBusinessReg ? 'Yes' : 'No',
      docsDeed: clientIntake.docsDeed ? 'Yes' : 'No',
      docsVehicleReg: clientIntake.docsVehicleReg ? 'Yes' : 'No',
      consent: clientIntake.consent ? 'Yes' : 'No',
      ...relatedPartiesData
    };

    await csvWriter.writeRecords([csvData]);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="client-intake-${clientIntake.legalName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv"`);

    // Read and send the CSV file
    const fs = require('fs');
    const csvContent = fs.readFileSync('temp-client-export.csv');
    res.send(csvContent);

    // Clean up temp file
    fs.unlinkSync('temp-client-export.csv');

  } catch (error) {
    console.error('Error exporting to CSV:', error);
    res.status(500).json({ 
      error: 'Failed to export to CSV',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/export/csv/all - Export all clients to CSV
router.get('/csv/all', async (req, res) => {
  try {
    const clientIntakes = await prisma.clientIntake.findMany({
      include: {
        relatedParties: true
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    const csvWriter = createCsvWriter.createObjectCsvWriter({
      path: 'temp-all-clients-export.csv',
      header: [
        { id: 'legalName', title: 'Legal Name' },
        { id: 'type', title: 'Type' },
        { id: 'ownerName', title: 'Owner Name' },
        { id: 'email', title: 'Email' },
        { id: 'phoneMobile', title: 'Mobile Phone' },
        { id: 'servicesSelected', title: 'Services Selected' },
        { id: 'tin', title: 'TIN' },
        { id: 'ramisStatus', title: 'RAMIS Status' },
        { id: 'submittedAt', title: 'Submitted At' }
      ]
    });

    const csvData = clientIntakes.map(client => ({
      ...client,
      servicesSelected: client.servicesSelected.join(', '),
      submittedAt: client.submittedAt.toLocaleDateString()
    }));

    await csvWriter.writeRecords(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="all-client-intakes-${new Date().toISOString().split('T')[0]}.csv"`);

    const fs = require('fs');
    const csvContent = fs.readFileSync('temp-all-clients-export.csv');
    res.send(csvContent);

    fs.unlinkSync('temp-all-clients-export.csv');

  } catch (error) {
    console.error('Error exporting all to CSV:', error);
    res.status(500).json({ 
      error: 'Failed to export all to CSV',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
