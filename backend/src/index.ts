import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routes
import intakeRoutes from './routes/intake';
import exportRoutes from './routes/export';
import authRoutes from './routes/auth';
import auditRoutes from './routes/audit';
import statsRoutes from './routes/stats';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});
const PORT = process.env.PORT || 3021;

// Database connection retry logic
const connectWithRetry = async (retries = 10, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully');
      
      // Try to initialize database schema
      try {
        console.log('🔄 Initializing database schema...');
        await prisma.$executeRaw`SELECT 1 FROM "ClientIntake" LIMIT 1`;
        console.log('✅ Database schema already exists');
      } catch (schemaError) {
        console.log('🔄 Database schema not found, creating tables...');
        const { execSync } = require('child_process');
        try {
          execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
          console.log('✅ Database schema created successfully');
        } catch (migrationError) {
          const errorMessage = migrationError instanceof Error ? migrationError.message : 'Unknown error';
          console.error('❌ Failed to create database schema:', errorMessage);
          // Continue anyway, let the app start
        }
      }
      
      return;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`❌ Database connection attempt ${i + 1} failed:`, errorMessage);
      if (i === retries - 1) {
        console.error('❌ Failed to connect to database after all retries');
        throw error;
      }
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3003',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// API Routes
app.use('/api/intake', intakeRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/stats', statsRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server with database connection retry
const startServer = async () => {
  try {
    await connectWithRetry();
  } catch (error) {
    console.error('❌ Database connection failed, starting server anyway:', error);
    // Continue without database for now
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API base: http://localhost:${PORT}/api`);
  });
};

startServer();

export default app;
