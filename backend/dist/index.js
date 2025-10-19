"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
// Import routes
const intake_1 = __importDefault(require("./routes/intake"));
const export_1 = __importDefault(require("./routes/export"));
const auth_1 = __importDefault(require("./routes/auth"));
const audit_1 = __importDefault(require("./routes/audit"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});
const PORT = process.env.PORT || 3000;
// Database connection retry logic
const connectWithRetry = async (retries = 10, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await prisma.$connect();
            console.log('✅ Database connected successfully');
            // Try to initialize database schema
            try {
                console.log('🔄 Initializing database schema...');
                await prisma.$executeRaw `SELECT 1 FROM "ClientIntake" LIMIT 1`;
                console.log('✅ Database schema already exists');
            }
            catch (schemaError) {
                console.log('🔄 Database schema not found, creating tables...');
                const { execSync } = require('child_process');
                try {
                    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
                    console.log('✅ Database schema created successfully');
                }
                catch (migrationError) {
                    const errorMessage = migrationError instanceof Error ? migrationError.message : 'Unknown error';
                    console.error('❌ Failed to create database schema:', errorMessage);
                    // Continue anyway, let the app start
                }
            }
            return;
        }
        catch (error) {
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
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
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
app.use('/api/intake', intake_1.default);
app.use('/api/export', export_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/audit', audit_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
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
    }
    catch (error) {
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
exports.default = app;
//# sourceMappingURL=index.js.map