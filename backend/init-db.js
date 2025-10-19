const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Try to create a test record to see if tables exist
    try {
      const testRecord = await prisma.clientIntake.create({
        data: {
          legalName: 'Test Company',
          type: 'INDIVIDUAL',
          ownerName: 'Test Owner',
          address: 'Test Address',
          phoneMobile: '1234567890',
          email: 'test@example.com',
          natureOfBusiness: 'Test Business',
          servicesSelected: ['Direct Tax'],
          tin: '123456789V',
          ramisStatus: 'AVAILABLE',
          consent: true,
          submittedBy: 'admin'
        }
      });
      console.log('✅ Test record created successfully');
      console.log('✅ Database tables exist and are working');
      
      // Clean up test record
      await prisma.clientIntake.delete({
        where: { id: testRecord.id }
      });
      console.log('✅ Test record cleaned up');
      
    } catch (error) {
      console.error('❌ Error creating test record:', error.message);
      
      if (error.message.includes('does not exist')) {
        console.log('🔄 Database tables do not exist. Running migration...');
        
        // Try to run migration
        const { execSync } = require('child_process');
        try {
          execSync('npx prisma db push', { stdio: 'inherit' });
          console.log('✅ Database migration completed');
        } catch (migrationError) {
          console.error('❌ Migration failed:', migrationError.message);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

initDatabase();
