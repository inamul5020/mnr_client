import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateUser, verifyDeletePasscode, logAuditAction, getClientIP, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Validation middleware
const validateIntake = [
  // Section A - Organization Details
  body('legalName').notEmpty().withMessage('Legal name is required'),
  body('type').isIn(['INDIVIDUAL', 'PARTNERSHIP', 'COMPANY', 'NGO', 'OTHER']).withMessage('Invalid client type'),
  body('ownerName').notEmpty().withMessage('Owner/Primary contact name is required'),
  body('address').notEmpty().withMessage('Business address is required'),
  body('phoneMobile').notEmpty().withMessage('Mobile phone is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('natureOfBusiness').notEmpty().withMessage('Nature of business is required'),
  
  // Section B - Services
  body('servicesSelected').isArray({ min: 1 }).withMessage('At least one service must be selected'),
  
  // Section E - RAMIS
  body('ramisStatus').isIn(['AVAILABLE', 'NOT_AVAILABLE']).withMessage('Invalid RAMIS status'),
  
  // Final
  body('consent').equals('true').withMessage('Consent must be given'),
];

// POST /api/intake - Submit new client intake
router.post('/', validateIntake, authenticateUser, async (req: AuthenticatedRequest, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      // Section A
      legalName, tradeName, type, ownerName, address, city, state, zipCode, country,
      phoneMobile, phoneLand, email, website, natureOfBusiness, industry, clientPriority,
      
      // Section B
      servicesSelected, serviceFrequency, tin,
      
      // Section C
      taxTypesSelected, otherRegistrations,
      
      // Section D
      companySecretary, registrationNumber, incorporationDate, annualRevenue, employeeCount,
      
      // Section E
      ramisStatus, ramisEmail, docsBusinessReg, docsDeed, docsVehicleReg, docsOther1, docsOther2, complianceNotes,
      
      // Section F
      creditLimit, paymentTerms, preferredCurrency,
      
      // Metadata
      notes, consent, createdBy,
      
      // Related parties
      relatedParties
    } = req.body;

    // Additional validation
    if (servicesSelected.includes('Direct Tax') || servicesSelected.includes('Indirect Tax')) {
      if (!tin) {
        return res.status(400).json({ 
          error: 'TIN is required when tax services are selected' 
        });
      }
    }

    if (type === 'COMPANY' && !companySecretary) {
      return res.status(400).json({ 
        error: 'Company Secretary is required for Company type' 
      });
    }

    // Create client intake record
    const clientIntake = await prisma.clientIntake.create({
      data: {
        // Section A
        legalName,
        tradeName,
        type,
        ownerName,
        address,
        city,
        state,
        zipCode,
        country,
        phoneMobile,
        phoneLand,
        email,
        website,
        natureOfBusiness,
        industry,
        clientPriority: clientPriority || 'MEDIUM',
        
        // Section B
        servicesSelected,
        serviceFrequency,
        tin,
        
        // Section C
        taxTypesSelected: taxTypesSelected || [],
        otherRegistrations,
        
        // Section D
        companySecretary,
        registrationNumber,
        incorporationDate: incorporationDate ? new Date(incorporationDate) : null,
        annualRevenue: annualRevenue ? parseFloat(annualRevenue) : null,
        employeeCount: employeeCount ? parseInt(employeeCount) : null,
        
        // Section E
        ramisStatus,
        ramisEmail,
        docsBusinessReg: docsBusinessReg || false,
        docsDeed: docsDeed || false,
        docsVehicleReg: docsVehicleReg || false,
        docsOther1,
        docsOther2,
        complianceNotes,
        
        // Section F
        creditLimit: creditLimit ? parseFloat(creditLimit) : null,
        paymentTerms,
        preferredCurrency: preferredCurrency || 'USD',
        
        // Metadata
        notes,
        consent,
        createdBy: req.user?.username || 'unknown',
        
        // Related parties
        relatedParties: {
          create: (relatedParties || []).map((party: any) => ({
            name: party.name,
            relationship: party.relationship,
            tin: party.tin,
            email: party.email,
            phone: party.phone
          }))
        }
      },
      include: {
        relatedParties: true
      }
    });

      // Log audit action
      await logAuditAction(
        'CREATE',
        'ClientIntake',
        clientIntake.id,
        req.user?.id || 'unknown',
        null,
        clientIntake,
        clientIntake.id,
        req
      );

    res.status(201).json({
      success: true,
      message: 'Client intake submitted successfully',
      data: clientIntake
    });

  } catch (error) {
    console.error('Error creating client intake:', error);
    res.status(500).json({ 
      error: 'Failed to create client intake',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/intake/:id - Update client intake (requires authentication)
router.put('/:id', validateIntake, authenticateUser, async (req: AuthenticatedRequest, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      // Section A
      legalName, tradeName, type, ownerName, address, city, state, zipCode, country,
      phoneMobile, phoneLand, email, website, natureOfBusiness, industry, clientPriority,
      
      // Section B
      servicesSelected, serviceFrequency, tin,
      
      // Section C
      taxTypesSelected, otherRegistrations,
      
      // Section D
      companySecretary, registrationNumber, incorporationDate, annualRevenue, employeeCount,
      
      // Section E
      ramisStatus, ramisEmail, docsBusinessReg, docsDeed, docsVehicleReg, docsOther1, docsOther2, complianceNotes,
      
      // Section F
      creditLimit, paymentTerms, preferredCurrency,
      
      // Metadata
      notes, consent, relatedParties
    } = req.body;

    // Check if client intake exists
    const existingClient = await prisma.clientIntake.findUnique({
      where: { id },
      include: { relatedParties: true }
    });

    if (!existingClient) {
      return res.status(404).json({ error: 'Client intake not found' });
    }

    // Additional validation
    if (type === 'COMPANY' && !companySecretary) {
      return res.status(400).json({ error: 'Company Secretary is required for Company type' });
    }

    const isTaxServiceSelected = servicesSelected?.includes('Direct Tax') || servicesSelected?.includes('Indirect Tax');
    if (isTaxServiceSelected && !tin) {
      return res.status(400).json({ error: 'TIN is required when tax services are selected' });
    }

    // Update client intake record
    const updatedClientIntake = await prisma.clientIntake.update({
      where: { id },
      data: {
        // Section A
        legalName,
        tradeName,
        type,
        ownerName,
        address,
        city,
        state,
        zipCode,
        country,
        phoneMobile,
        phoneLand,
        email,
        website,
        natureOfBusiness,
        industry,
        clientPriority: clientPriority || 'MEDIUM',
        
        // Section B
        servicesSelected: servicesSelected || [],
        serviceFrequency,
        tin,
        
        // Section C
        taxTypesSelected: taxTypesSelected || [],
        otherRegistrations,
        
        // Section D
        companySecretary,
        registrationNumber,
        incorporationDate: incorporationDate ? new Date(incorporationDate) : null,
        annualRevenue: annualRevenue ? parseFloat(annualRevenue) : null,
        employeeCount: employeeCount ? parseInt(employeeCount) : null,
        
        // Section E
        ramisStatus,
        ramisEmail,
        docsBusinessReg: docsBusinessReg || false,
        docsDeed: docsDeed || false,
        docsVehicleReg: docsVehicleReg || false,
        docsOther1,
        docsOther2,
        complianceNotes,
        
        // Section F
        creditLimit: creditLimit ? parseFloat(creditLimit) : null,
        paymentTerms,
        preferredCurrency: preferredCurrency || 'USD',
        
        // Metadata
        notes,
        consent,
        updatedBy: req.user?.username || 'unknown',
        
        // Related parties - delete existing and create new ones
        relatedParties: {
          deleteMany: {},
          create: (relatedParties || []).map((party: any) => ({
            name: party.name,
            relationship: party.relationship,
            tin: party.tin,
            email: party.email,
            phone: party.phone
          }))
        }
      },
      include: {
        relatedParties: true
      }
    });

    // Log audit action
    await logAuditAction(
      'UPDATE',
      'ClientIntake',
      id,
      req.user?.id || 'unknown',
      existingClient,
      updatedClientIntake,
      id,
      req
    );

    res.json({
      success: true,
      message: 'Client intake updated successfully',
      data: updatedClientIntake
    });

  } catch (error) {
    console.error('Error updating client intake:', error);
    res.status(500).json({
      error: 'Failed to update client intake',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/intake - List all client intakes with filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = '1',
      limit = '10',
      type,
      service,
      taxType,
      ramisStatus,
      search,
      sortBy = 'submittedAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      deletedAt: null // Only show non-deleted records
    };
    
    if (type) where.type = type;
    if (ramisStatus) where.ramisStatus = ramisStatus;
    if (service) where.servicesSelected = { has: service };
    if (taxType) where.taxTypesSelected = { has: taxType };
    if (search) {
      where.OR = [
        { legalName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { ownerName: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [clientIntakes, total] = await Promise.all([
      prisma.clientIntake.findMany({
        where,
        include: {
          relatedParties: true
        },
        orderBy: {
          [sortBy as string]: sortOrder as 'asc' | 'desc'
        },
        skip,
        take: limitNum
      }),
      prisma.clientIntake.count({ where })
    ]);

    res.json({
      success: true,
      data: clientIntakes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Error fetching client intakes:', error);
    res.status(500).json({ 
      error: 'Failed to fetch client intakes',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/intake/:id - Get single client intake
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const clientIntake = await prisma.clientIntake.findUnique({
      where: { id },
      include: {
        relatedParties: true
      }
    });

    if (!clientIntake) {
      return res.status(404).json({ 
        error: 'Client intake not found' 
      });
    }

    res.json({
      success: true,
      data: clientIntake
    });

  } catch (error) {
    console.error('Error fetching client intake:', error);
    res.status(500).json({ 
      error: 'Failed to fetch client intake',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/intake/:id - Delete client intake (requires passcode and authentication)
router.delete('/:id', authenticateUser, verifyDeletePasscode, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    // Get the client intake before deletion for audit logging
    const clientIntake = await prisma.clientIntake.findUnique({
      where: { id },
      include: {
        relatedParties: true
      }
    });

    if (!clientIntake) {
      return res.status(404).json({ 
        error: 'Client intake not found' 
      });
    }

    // Soft delete - mark as deleted instead of hard delete
    await prisma.clientIntake.update({
      where: { id },
      data: {
        deletedBy: req.user?.username || 'unknown',
        deletedAt: new Date()
      }
    });

    // Log audit action
    await logAuditAction(
      'DELETE',
      'ClientIntake',
      id,
      req.user?.id || 'unknown',
      clientIntake,
      null,
      id,
      req
    );

    res.json({
      success: true,
      message: 'Client intake deleted successfully',
      deletedBy: req.user?.username,
      deletedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error deleting client intake:', error);
    res.status(500).json({ 
      error: 'Failed to delete client intake',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
