"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const exceljs_1 = __importDefault(require("exceljs"));
const createCsvWriter = __importStar(require("csv-writer"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Helper function to format tax return years for export
function formatTaxReturnYears(taxReturnYears) {
    if (!taxReturnYears || typeof taxReturnYears !== 'object') {
        return '';
    }
    const formattedEntries = Object.entries(taxReturnYears).map(([category, years]) => {
        if (Array.isArray(years) && years.length > 0) {
            return `${category}: ${years.join(', ')}`;
        }
        return `${category}: No years submitted`;
    });
    return formattedEntries.join(' | ');
}
// GET /api/export/excel-all - Export all clients to Excel with comprehensive details
router.get('/excel-all', async (req, res) => {
    try {
        const clientIntakes = await prisma.clientIntake.findMany({
            include: {
                relatedParties: true
            },
            orderBy: {
                submittedAt: 'desc'
            }
        });
        const workbook = new exceljs_1.default.Workbook();
        // Create a comprehensive sheet with all client details
        const sheet = workbook.addWorksheet('All Client Intakes - Comprehensive');
        // Define comprehensive headers
        sheet.columns = [
            { header: 'Legal Name', key: 'legalName', width: 25 },
            { header: 'Trade Name', key: 'tradeName', width: 25 },
            { header: 'Type', key: 'type', width: 15 },
            { header: 'Owner Name', key: 'ownerName', width: 25 },
            { header: 'Managed By', key: 'managedBy', width: 15 },
            { header: 'Other Contact Name', key: 'managedByContactName', width: 25 },
            { header: 'Address', key: 'address', width: 40 },
            { header: 'City', key: 'city', width: 20 },
            { header: 'State', key: 'state', width: 20 },
            { header: 'ZIP Code', key: 'zipCode', width: 15 },
            { header: 'Country', key: 'country', width: 20 },
            { header: 'Mobile Phone', key: 'phoneMobile', width: 20 },
            { header: 'Landline Phone', key: 'phoneLand', width: 20 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Website', key: 'website', width: 30 },
            { header: 'Nature of Business', key: 'natureOfBusiness', width: 30 },
            { header: 'Industry', key: 'industry', width: 20 },
            { header: 'Client Priority', key: 'clientPriority', width: 15 },
            { header: 'Services Selected', key: 'servicesSelected', width: 40 },
            { header: 'Service Frequency', key: 'serviceFrequency', width: 20 },
            { header: 'TIN', key: 'tin', width: 15 },
            { header: 'Tax Types Selected', key: 'taxTypesSelected', width: 30 },
            { header: 'Tax Return Years', key: 'taxReturnYears', width: 40 },
            { header: 'Other Registrations', key: 'otherRegistrations', width: 30 },
            { header: 'Company Secretary', key: 'companySecretary', width: 25 },
            { header: 'Registration Number', key: 'registrationNumber', width: 20 },
            { header: 'Incorporation Date', key: 'incorporationDate', width: 20 },
            { header: 'Annual Revenue', key: 'annualRevenue', width: 20 },
            { header: 'Employee Count', key: 'employeeCount', width: 15 },
            { header: 'RAMIS Status', key: 'ramisStatus', width: 15 },
            { header: 'RAMIS Email', key: 'ramisEmail', width: 30 },
            { header: 'Business Registration Doc', key: 'docsBusinessReg', width: 20 },
            { header: 'Deed Copy Doc', key: 'docsDeed', width: 20 },
            { header: 'Vehicle Registration Doc', key: 'docsVehicleReg', width: 20 },
            { header: 'Other Document 1', key: 'docsOther1', width: 25 },
            { header: 'Other Document 2', key: 'docsOther2', width: 25 },
            { header: 'Compliance Notes', key: 'complianceNotes', width: 30 },
            { header: 'Notes', key: 'notes', width: 40 },
            { header: 'Consent Given', key: 'consent', width: 15 },
            { header: 'Created By', key: 'createdBy', width: 20 },
            { header: 'Submitted At', key: 'submittedAt', width: 20 },
            { header: 'Related Party 1 Name', key: 'relatedParty1Name', width: 25 },
            { header: 'Related Party 1 Relationship', key: 'relatedParty1Relationship', width: 20 },
            { header: 'Related Party 1 TIN', key: 'relatedParty1Tin', width: 15 },
            { header: 'Related Party 1 Email', key: 'relatedParty1Email', width: 30 },
            { header: 'Related Party 1 Phone', key: 'relatedParty1Phone', width: 20 },
            { header: 'Related Party 2 Name', key: 'relatedParty2Name', width: 25 },
            { header: 'Related Party 2 Relationship', key: 'relatedParty2Relationship', width: 20 },
            { header: 'Related Party 2 TIN', key: 'relatedParty2Tin', width: 15 },
            { header: 'Related Party 2 Email', key: 'relatedParty2Email', width: 30 },
            { header: 'Related Party 2 Phone', key: 'relatedParty2Phone', width: 20 },
            { header: 'Related Party 3 Name', key: 'relatedParty3Name', width: 25 },
            { header: 'Related Party 3 Relationship', key: 'relatedParty3Relationship', width: 20 },
            { header: 'Related Party 3 TIN', key: 'relatedParty3Tin', width: 15 },
            { header: 'Related Party 3 Email', key: 'relatedParty3Email', width: 30 },
            { header: 'Related Party 3 Phone', key: 'relatedParty3Phone', width: 20 },
            { header: 'Related Party 4 Name', key: 'relatedParty4Name', width: 25 },
            { header: 'Related Party 4 Relationship', key: 'relatedParty4Relationship', width: 20 },
            { header: 'Related Party 4 TIN', key: 'relatedParty4Tin', width: 15 },
            { header: 'Related Party 4 Email', key: 'relatedParty4Email', width: 30 },
            { header: 'Related Party 4 Phone', key: 'relatedParty4Phone', width: 20 }
        ];
        // Add data rows with comprehensive information
        clientIntakes.forEach(client => {
            // Prepare related parties data
            const relatedParties = client.relatedParties || [];
            const relatedParty1 = relatedParties[0] || {};
            const relatedParty2 = relatedParties[1] || {};
            const relatedParty3 = relatedParties[2] || {};
            const relatedParty4 = relatedParties[3] || {};
            sheet.addRow({
                legalName: client.legalName,
                tradeName: client.tradeName || '',
                type: client.type,
                ownerName: client.ownerName,
                managedBy: client.managedBy || '',
                managedByContactName: client.managedByContactName || '',
                address: client.address,
                city: client.city || '',
                state: client.state || '',
                zipCode: client.zipCode || '',
                country: client.country || '',
                phoneMobile: client.phoneMobile,
                phoneLand: client.phoneLand || '',
                email: client.email,
                website: client.website || '',
                natureOfBusiness: client.natureOfBusiness,
                industry: client.industry || '',
                clientPriority: client.clientPriority || '',
                servicesSelected: (client.servicesSelected || []).join(', '),
                serviceFrequencies: client.serviceFrequencies ? JSON.stringify(client.serviceFrequencies) : '',
                tin: client.tin || '',
                incomeTaxTypes: (client.incomeTaxTypes || []).join(', '),
                taxReturnYears: client.taxReturnYears ? formatTaxReturnYears(client.taxReturnYears) : '',
                otherRegistrations: client.otherRegistrations || '',
                companySecretary: client.companySecretary || '',
                registrationNumber: client.registrationNumber || '',
                incorporationDate: client.incorporationDate ? client.incorporationDate.toLocaleDateString() : '',
                annualRevenue: client.annualRevenue ? client.annualRevenue.toString() : '',
                employeeCount: client.employeeCount ? client.employeeCount.toString() : '',
                ramisStatus: client.ramisStatus,
                ramisEmail: client.ramisEmail || '',
                docsBusinessReg: client.docsBusinessReg ? 'Yes' : 'No',
                docsDeed: client.docsDeed ? 'Yes' : 'No',
                docsVehicleReg: client.docsVehicleReg ? 'Yes' : 'No',
                docsOther1: client.docsOther1 || '',
                docsOther2: client.docsOther2 || '',
                complianceNotes: client.complianceNotes || '',
                notes: client.notes || '',
                consent: client.consent ? 'Yes' : 'No',
                createdBy: client.createdBy || '',
                submittedAt: client.submittedAt.toLocaleString(),
                // Related Parties
                relatedParty1Name: relatedParty1.name || '',
                relatedParty1Relationship: relatedParty1.relationship || '',
                relatedParty1Tin: relatedParty1.tin || '',
                relatedParty1Email: relatedParty1.email || '',
                relatedParty1Phone: relatedParty1.phone || '',
                relatedParty2Name: relatedParty2.name || '',
                relatedParty2Relationship: relatedParty2.relationship || '',
                relatedParty2Tin: relatedParty2.tin || '',
                relatedParty2Email: relatedParty2.email || '',
                relatedParty2Phone: relatedParty2.phone || '',
                relatedParty3Name: relatedParty3.name || '',
                relatedParty3Relationship: relatedParty3.relationship || '',
                relatedParty3Tin: relatedParty3.tin || '',
                relatedParty3Email: relatedParty3.email || '',
                relatedParty3Phone: relatedParty3.phone || '',
                relatedParty4Name: relatedParty4.name || '',
                relatedParty4Relationship: relatedParty4.relationship || '',
                relatedParty4Tin: relatedParty4.tin || '',
                relatedParty4Email: relatedParty4.email || '',
                relatedParty4Phone: relatedParty4.phone || ''
            });
        });
        // Style the header row
        sheet.getRow(1).font = { bold: true };
        sheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6FA' }
        };
        // Auto-fit columns
        sheet.columns.forEach(column => {
            if (column.width) {
                column.width = Math.min(column.width, 50); // Cap at 50 for readability
            }
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="all-client-intakes-comprehensive-${new Date().toISOString().split('T')[0]}.xlsx"`);
        await workbook.xlsx.write(res);
        res.end();
    }
    catch (error) {
        console.error('Error exporting all to Excel:', error);
        res.status(500).json({
            error: 'Failed to export all to Excel',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
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
        const workbook = new exceljs_1.default.Workbook();
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
        clientSheet.addRow({ field: 'Managed By', value: clientIntake.managedBy || '' });
        if (clientIntake.managedBy === 'Other' && clientIntake.managedByContactName) {
            clientSheet.addRow({ field: 'Other Contact Name', value: clientIntake.managedByContactName });
        }
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
        // Section B - Services & Tax Profile (merged)
        clientSheet.addRow({ field: 'Services Selected', value: clientIntake.servicesSelected.join(', ') });
        clientSheet.addRow({ field: 'Direct Tax Subcategories', value: clientIntake.directTaxSubcategories?.join(', ') || '' });
        clientSheet.addRow({ field: 'Indirect Tax Subcategories', value: clientIntake.indirectTaxSubcategories?.join(', ') || '' });
        clientSheet.addRow({ field: 'Income Tax Types', value: clientIntake.incomeTaxTypes?.join(', ') || '' });
        clientSheet.addRow({ field: 'Service Frequencies', value: JSON.stringify(clientIntake.serviceFrequencies || {}) });
        clientSheet.addRow({ field: 'Tax Return Years', value: JSON.stringify(clientIntake.taxReturnYears || {}) });
        clientSheet.addRow({ field: 'TIN', value: clientIntake.tin || '' });
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
    }
    catch (error) {
        console.error('Error exporting to Excel:', error);
        res.status(500).json({
            error: 'Failed to export to Excel',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// GET /api/export/csv-all - Export all clients to CSV with comprehensive details
router.get('/csv-all', async (req, res) => {
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
            path: 'temp-all-clients-comprehensive-export.csv',
            header: [
                { id: 'legalName', title: 'Legal Name' },
                { id: 'tradeName', title: 'Trade Name' },
                { id: 'type', title: 'Type' },
                { id: 'ownerName', title: 'Owner Name' },
                { id: 'managedBy', title: 'Managed By' },
                { id: 'managedByContactName', title: 'Other Contact Name' },
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
                { id: 'taxReturnYears', title: 'Tax Return Years' },
                { id: 'otherRegistrations', title: 'Other Registrations' },
                { id: 'companySecretary', title: 'Company Secretary' },
                { id: 'registrationNumber', title: 'Registration Number' },
                { id: 'incorporationDate', title: 'Incorporation Date' },
                { id: 'annualRevenue', title: 'Annual Revenue' },
                { id: 'employeeCount', title: 'Employee Count' },
                { id: 'ramisStatus', title: 'RAMIS Status' },
                { id: 'ramisEmail', title: 'RAMIS Email' },
                { id: 'docsBusinessReg', title: 'Business Registration Doc' },
                { id: 'docsDeed', title: 'Deed Copy Doc' },
                { id: 'docsVehicleReg', title: 'Vehicle Registration Doc' },
                { id: 'docsOther1', title: 'Other Document 1' },
                { id: 'docsOther2', title: 'Other Document 2' },
                { id: 'complianceNotes', title: 'Compliance Notes' },
                { id: 'notes', title: 'Notes' },
                { id: 'consent', title: 'Consent Given' },
                { id: 'createdBy', title: 'Created By' },
                { id: 'submittedAt', title: 'Submitted At' },
                // Related parties headers
                { id: 'relatedParty1Name', title: 'Related Party 1 Name' },
                { id: 'relatedParty1Relationship', title: 'Related Party 1 Relationship' },
                { id: 'relatedParty1Tin', title: 'Related Party 1 TIN' },
                { id: 'relatedParty1Email', title: 'Related Party 1 Email' },
                { id: 'relatedParty1Phone', title: 'Related Party 1 Phone' },
                { id: 'relatedParty2Name', title: 'Related Party 2 Name' },
                { id: 'relatedParty2Relationship', title: 'Related Party 2 Relationship' },
                { id: 'relatedParty2Tin', title: 'Related Party 2 TIN' },
                { id: 'relatedParty2Email', title: 'Related Party 2 Email' },
                { id: 'relatedParty2Phone', title: 'Related Party 2 Phone' },
                { id: 'relatedParty3Name', title: 'Related Party 3 Name' },
                { id: 'relatedParty3Relationship', title: 'Related Party 3 Relationship' },
                { id: 'relatedParty3Tin', title: 'Related Party 3 TIN' },
                { id: 'relatedParty3Email', title: 'Related Party 3 Email' },
                { id: 'relatedParty3Phone', title: 'Related Party 3 Phone' },
                { id: 'relatedParty4Name', title: 'Related Party 4 Name' },
                { id: 'relatedParty4Relationship', title: 'Related Party 4 Relationship' },
                { id: 'relatedParty4Tin', title: 'Related Party 4 TIN' },
                { id: 'relatedParty4Email', title: 'Related Party 4 Email' },
                { id: 'relatedParty4Phone', title: 'Related Party 4 Phone' }
            ]
        });
        const csvData = clientIntakes.map(client => {
            // Prepare related parties data
            const relatedParties = client.relatedParties || [];
            const relatedParty1 = relatedParties[0] || {};
            const relatedParty2 = relatedParties[1] || {};
            const relatedParty3 = relatedParties[2] || {};
            const relatedParty4 = relatedParties[3] || {};
            return {
                ...client,
                servicesSelected: (client.servicesSelected || []).join(', '),
                incomeTaxTypes: (client.incomeTaxTypes || []).join(', '),
                taxReturnYears: client.taxReturnYears ? formatTaxReturnYears(client.taxReturnYears) : '',
                incorporationDate: client.incorporationDate?.toLocaleDateString() || '',
                submittedAt: client.submittedAt.toLocaleString(),
                docsBusinessReg: client.docsBusinessReg ? 'Yes' : 'No',
                docsDeed: client.docsDeed ? 'Yes' : 'No',
                docsVehicleReg: client.docsVehicleReg ? 'Yes' : 'No',
                consent: client.consent ? 'Yes' : 'No',
                // Related parties data
                relatedParty1Name: relatedParty1.name || '',
                relatedParty1Relationship: relatedParty1.relationship || '',
                relatedParty1Tin: relatedParty1.tin || '',
                relatedParty1Email: relatedParty1.email || '',
                relatedParty1Phone: relatedParty1.phone || '',
                relatedParty2Name: relatedParty2.name || '',
                relatedParty2Relationship: relatedParty2.relationship || '',
                relatedParty2Tin: relatedParty2.tin || '',
                relatedParty2Email: relatedParty2.email || '',
                relatedParty2Phone: relatedParty2.phone || '',
                relatedParty3Name: relatedParty3.name || '',
                relatedParty3Relationship: relatedParty3.relationship || '',
                relatedParty3Tin: relatedParty3.tin || '',
                relatedParty3Email: relatedParty3.email || '',
                relatedParty3Phone: relatedParty3.phone || '',
                relatedParty4Name: relatedParty4.name || '',
                relatedParty4Relationship: relatedParty4.relationship || '',
                relatedParty4Tin: relatedParty4.tin || '',
                relatedParty4Email: relatedParty4.email || '',
                relatedParty4Phone: relatedParty4.phone || ''
            };
        });
        await csvWriter.writeRecords(csvData);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="all-client-intakes-comprehensive-${new Date().toISOString().split('T')[0]}.csv"`);
        const fs = require('fs');
        const csvContent = fs.readFileSync('temp-all-clients-comprehensive-export.csv');
        res.send(csvContent);
        fs.unlinkSync('temp-all-clients-comprehensive-export.csv');
    }
    catch (error) {
        console.error('Error exporting all to CSV:', error);
        res.status(500).json({
            error: 'Failed to export all to CSV',
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
                { id: 'managedBy', title: 'Managed By' },
                { id: 'managedByContactName', title: 'Other Contact Name' },
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
                { id: 'directTaxSubcategories', title: 'Direct Tax Subcategories' },
                { id: 'indirectTaxSubcategories', title: 'Indirect Tax Subcategories' },
                { id: 'incomeTaxTypes', title: 'Income Tax Types' },
                { id: 'serviceFrequencies', title: 'Service Frequencies' },
                { id: 'taxReturnYears', title: 'Tax Return Years' },
                { id: 'tin', title: 'TIN' },
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
            directTaxSubcategories: clientIntake.directTaxSubcategories?.join(', ') || '',
            indirectTaxSubcategories: clientIntake.indirectTaxSubcategories?.join(', ') || '',
            incomeTaxTypes: clientIntake.incomeTaxTypes?.join(', ') || '',
            serviceFrequencies: JSON.stringify(clientIntake.serviceFrequencies || {}),
            taxReturnYears: JSON.stringify(clientIntake.taxReturnYears || {}),
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
    }
    catch (error) {
        console.error('Error exporting to CSV:', error);
        res.status(500).json({
            error: 'Failed to export to CSV',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=export.js.map