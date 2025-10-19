const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://mnr_user:mnr_password@localhost:5432/mnr_client_intake'
  });

  try {
    console.log('🔄 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    console.log('🔄 Reading SQL initialization script...');
    const sqlScript = fs.readFileSync(path.join(__dirname, 'init-database.sql'), 'utf8');
    
    console.log('🔄 Running database initialization...');
    await client.query(sqlScript);
    
    console.log('✅ Database initialized successfully');
    console.log('✅ Tables created and users inserted');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

initDatabase();
