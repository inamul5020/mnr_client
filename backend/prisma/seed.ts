import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample client intake records
  const sampleClients = [
    {
      legalName: 'ABC Manufacturing Ltd',
      tradeName: 'ABC Manufacturing',
      type: 'COMPANY' as const,
      ownerName: 'John Smith',
      address: '123 Industrial Road, Colombo 10',
      city: 'Colombo',
      state: 'Western Province',
      zipCode: '10000',
      country: 'Sri Lanka',
      phoneMobile: '+94 77 123 4567',
      phoneLand: '+94 11 234 5678',
      email: 'john@abcmanufacturing.com',
      website: 'https://www.abcmanufacturing.com',
      natureOfBusiness: 'Manufacturing of electronic components',
      industry: 'Manufacturing',
      clientPriority: 'HIGH' as const,
      servicesSelected: ['Direct Tax', 'Indirect Tax', 'HR Services'],
      serviceFrequency: 'Monthly',
      tin: '123456789V',
      taxTypesSelected: ['Income Tax', 'VAT'],
      otherRegistrations: 'BOI registration, Export license',
      companySecretary: 'Jane Doe',
      registrationNumber: 'PV123456',
      incorporationDate: new Date('2020-01-15'),
      annualRevenue: 5000000,
      employeeCount: 150,
      ramisStatus: 'AVAILABLE' as const,
      ramisEmail: 'ramis@abcmanufacturing.com',
      docsBusinessReg: true,
      docsDeed: true,
      docsVehicleReg: false,
      docsOther1: 'BOI Certificate',
      docsOther2: 'Export License',
      complianceNotes: 'Regular compliance with BOI requirements',
      creditLimit: 100000,
      paymentTerms: 'Net 30',
      preferredCurrency: 'USD',
      notes: 'Long-term client with excellent payment history',
      consent: true,
      createdBy: 'admin',
      relatedParties: [
        {
          name: 'John Smith',
          relationship: 'Director',
          tin: '123456789V',
          email: 'john@abcmanufacturing.com',
          phone: '+94 77 123 4567'
        },
        {
          name: 'Jane Doe',
          relationship: 'Company Secretary',
          tin: '987654321V',
          email: 'jane@abcmanufacturing.com',
          phone: '+94 77 987 6543'
        }
      ]
    },
    {
      legalName: 'XYZ Trading Partnership',
      tradeName: 'XYZ Traders',
      type: 'PARTNERSHIP' as const,
      ownerName: 'Robert Johnson',
      address: '456 Commercial Street, Kandy',
      city: 'Kandy',
      state: 'Central Province',
      zipCode: '20000',
      country: 'Sri Lanka',
      phoneMobile: '+94 77 555 1234',
      email: 'robert@xyztraders.com',
      natureOfBusiness: 'Import and export of agricultural products',
      industry: 'Retail & Wholesale',
      clientPriority: 'MEDIUM' as const,
      servicesSelected: ['Indirect Tax', 'Trade License'],
      serviceFrequency: 'Quarterly',
      tin: '555666777V',
      taxTypesSelected: ['VAT'],
      ramisStatus: 'NOT_AVAILABLE' as const,
      docsBusinessReg: true,
      docsDeed: true,
      docsVehicleReg: true,
      complianceNotes: 'New partnership, requires guidance on tax compliance',
      paymentTerms: 'Net 15',
      preferredCurrency: 'LKR',
      notes: 'New client, needs assistance with tax registration',
      consent: true,
      createdBy: 'admin',
      relatedParties: [
        {
          name: 'Robert Johnson',
          relationship: 'Partner',
          tin: '555666777V',
          email: 'robert@xyztraders.com',
          phone: '+94 77 555 1234'
        },
        {
          name: 'Sarah Wilson',
          relationship: 'Partner',
          tin: '111222333V',
          email: 'sarah@xyztraders.com',
          phone: '+94 77 111 2233'
        }
      ]
    }
  ];

  for (const clientData of sampleClients) {
    const { relatedParties, ...clientIntakeData } = clientData;
    
    const client = await prisma.clientIntake.create({
      data: {
        ...clientIntakeData,
        relatedParties: {
          create: relatedParties
        }
      }
    });
    
    console.log(`✅ Created client: ${client.legalName}`);
  }

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
