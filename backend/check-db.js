const { Client } = require('pg');

async function checkDatabase() {
  const client = new Client({
    connectionString: 'postgresql://mnr_user:mnr_password@api.mnrlk.com:5432/mnr_client_intake'
  });

  try {
    console.log('🔄 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    // Check if tables exist
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('ClientIntake', 'User', 'RelatedParty', 'AuditLog')
    `);
    
    console.log('📊 Existing tables:', result.rows.map(row => row.table_name));
    
    if (result.rows.length === 0) {
      console.log('❌ No tables found - database needs initialization');
    } else {
      console.log('✅ Tables found - database is ready');
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    await client.end();
  }
}

checkDatabase();
