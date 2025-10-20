# 🚀 **Bolt.new Backend API Template Guide**

**A comprehensive template for generating backend API code that integrates seamlessly with our existing setup.**

---

## 📋 **Project Context**

**Project Type**: Multi-tenant SaaS Backend API  
**Tech Stack**: Node.js + Express + TypeScript + PostgreSQL + Prisma  
**Architecture**: RESTful API with JWT authentication and role-based access control  

---

## 🎯 **Core Requirements**

### **1. Project Structure**
```
server/
├── src/
│   ├── index.ts                 # Main server file
│   ├── database/
│   │   └── connection.ts        # Database connection
│   ├── middleware/
│   │   ├── auth.ts             # Authentication middleware
│   │   └── errorHandler.ts     # Error handling
│   ├── routes/
│   │   ├── auth.ts             # Authentication routes
│   │   ├── members.ts          # Member management
│   │   ├── households.ts       # Household management
│   │   ├── receipts.ts         # Receipt management
│   │   └── [feature].ts        # Feature-specific routes
│   └── types/
│       └── index.ts            # TypeScript type definitions
├── prisma/
│   └── schema.prisma           # Database schema
├── .env                        # Environment variables
├── package.json                # Dependencies
└── tsconfig.json              # TypeScript config
```

### **2. Essential Dependencies**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "pg": "^8.11.3",
    "dotenv": "^16.3.1",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcryptjs": "^2.4.6",
    "@types/pg": "^8.10.9",
    "tsx": "^4.6.2",
    "nodemon": "^3.0.2"
  }
}
```

---

## 🔧 **Implementation Instructions**

### **Step 1: Server Setup (index.ts)**
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import memberRoutes from './routes/members';
import householdRoutes from './routes/households';
import receiptRoutes from './routes/receipts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/households', householdRoutes);
app.use('/api/receipts', receiptRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('✅ Database connected successfully');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('📊 Environment: development');
});
```

### **Step 2: Database Connection (database/connection.ts)**
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export class Database {
  static async query(text: string, params?: any[]) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  }

  static async getClient() {
    return await pool.connect();
  }
}

// Test connection
Database.query('SELECT NOW()')
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection failed:', err));
```

### **Step 3: Authentication Middleware (middleware/auth.ts)**
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  masjidId?: string;
  userRole?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.userId = user.userId;
    next();
  });
};

export const requireMasjidAccess = (req: AuthRequest, res: Response, next: NextFunction) => {
  const masjidId = req.params.masjidId;
  if (!masjidId) {
    return res.status(400).json({ error: 'Masjid ID required' });
  }
  req.masjidId = masjidId;
  next();
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

### **Step 4: Error Handling (middleware/errorHandler.ts)**
```typescript
import { Request, Response, NextFunction } from 'express';

export const createError = (message: string, statusCode: number = 500) => {
  const error: any = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

### **Step 5: Route Template (routes/[feature].ts)**
```typescript
import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { Database } from '../database/connection';
import { authenticateToken, requireMasjidAccess, requireRole, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// GET /api/[feature]/:masjidId - List all items
router.get('/:masjidId',
  authenticateToken,
  requireMasjidAccess,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString(),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = (page - 1) * limit;
      const search = req.query.search as string;

      let whereClause = 'WHERE masjid_id = $1';
      const params = [req.masjidId];
      let paramCount = 1;

      if (search) {
        paramCount++;
        whereClause += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
        params.push(`%${search}%`);
      }

      const query = `
        SELECT * FROM [table_name]
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
      `;

      params.push(limit.toString(), offset.toString());
      const result = await Database.query(query, params);

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM [table_name] ${whereClause}`;
      const countResult = await Database.query(countQuery, params.slice(0, -2));
      const total = parseInt(countResult.rows[0].total);

      res.json({
        data: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/[feature]/:masjidId - Create new item
router.post('/:masjidId',
  authenticateToken,
  requireMasjidAccess,
  requireRole(['admin', 'staff']),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').optional().isString(),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description } = req.body;

      const result = await Database.query(`
        INSERT INTO [table_name] (masjid_id, name, description, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING *
      `, [req.masjidId, name, description]);

      res.status(201).json({
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/[feature]/:masjidId/:id - Get single item
router.get('/:masjidId/:id',
  authenticateToken,
  requireMasjidAccess,
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;

      const result = await Database.query(`
        SELECT * FROM [table_name]
        WHERE id = $1 AND masjid_id = $2
      `, [id, req.masjidId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.json({ data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/[feature]/:masjidId/:id - Update item
router.put('/:masjidId/:id',
  authenticateToken,
  requireMasjidAccess,
  requireRole(['admin', 'staff']),
  [
    body('name').optional().notEmpty(),
    body('description').optional().isString(),
  ],
  async (req: AuthRequest, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { name, description } = req.body;

      const result = await Database.query(`
        UPDATE [table_name]
        SET name = COALESCE($1, name),
            description = COALESCE($2, description),
            updated_at = NOW()
        WHERE id = $3 AND masjid_id = $4
        RETURNING *
      `, [name, description, id, req.masjidId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.json({ data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/[feature]/:masjidId/:id - Delete item
router.delete('/:masjidId/:id',
  authenticateToken,
  requireMasjidAccess,
  requireRole(['admin']),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;

      const result = await Database.query(`
        DELETE FROM [table_name]
        WHERE id = $1 AND masjid_id = $2
        RETURNING *
      `, [id, req.masjidId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export { router as [feature]Routes };
```

---

## 🗄️ **Database Schema Template (prisma/schema.prisma)**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Core tables
model Masjid {
  id        String   @id @default(uuid())
  name      String
  email     String?
  phone     String?
  address   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  users     MasjidUser[]
  members   Member[]
  households Household[]
  receipts  Receipt[]

  @@map("masjids")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  isSuperAdmin Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  masjidUsers MasjidUser[]
  receipts    Receipt[]

  @@map("users")
}

model MasjidUser {
  id       String @id @default(uuid())
  userId   String
  masjidId String
  role     Role   @default(staff)
  status   Status @default(active)

  // Relations
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  masjid Masjid @relation(fields: [masjidId], references: [id], onDelete: Cascade)

  @@unique([userId, masjidId])
  @@map("masjid_users")
}

// Feature-specific tables
model [Feature] {
  id          String   @id @default(uuid())
  masjidId    String
  name        String
  description String?
  status      Status   @default(active)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  masjid Masjid @relation(fields: [masjidId], references: [id], onDelete: Cascade)

  @@map("[feature_table]")
}

// Enums
enum Role {
  admin
  accountant
  staff
  member
}

enum Status {
  active
  inactive
  archived
}
```

---

## 🔐 **Environment Variables (.env)**

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/your_database

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=3001
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 📦 **Package.json Scripts**

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

---

## 🎯 **Bolt.new Instructions**

### **Prompt Template:**
```
Create a Node.js + Express + TypeScript backend API with the following requirements:

1. **Project Structure**: Use the exact folder structure provided above
2. **Dependencies**: Install all specified dependencies
3. **Database**: PostgreSQL with raw SQL queries (no ORM)
4. **Authentication**: JWT-based with role-based access control
5. **Security**: CORS, Helmet, Rate limiting
6. **Error Handling**: Comprehensive error handling middleware
7. **Validation**: Express-validator for input validation
8. **Multi-tenant**: All routes scoped to masjid_id
9. **CRUD Operations**: Full CRUD for all entities
10. **Pagination**: Built-in pagination for list endpoints

**Key Features to Implement:**
- Health check endpoint
- Authentication routes (login, register)
- [Feature] management routes
- Proper TypeScript types
- Environment configuration
- Database connection with connection pooling

**Follow the exact code templates provided above and ensure:**
- All routes are properly authenticated
- Multi-tenant architecture (masjid_id scoping)
- Proper error handling and validation
- TypeScript types for all interfaces
- Consistent API response format
- Security best practices

Generate the complete backend with all files and proper configuration.
```

---

## ✅ **Validation Checklist**

After generation, ensure:

- [ ] All routes are properly authenticated
- [ ] Multi-tenant scoping (masjid_id) is implemented
- [ ] Error handling middleware is in place
- [ ] Input validation is comprehensive
- [ ] TypeScript types are properly defined
- [ ] Database connection is configured
- [ ] Environment variables are set up
- [ ] CORS is configured for frontend ports
- [ ] Rate limiting is implemented
- [ ] Security headers are in place
- [ ] API responses follow consistent format
- [ ] CRUD operations are complete
- [ ] Pagination is implemented
- [ ] Health check endpoint exists

---

## 🚀 **Usage Instructions**

1. **Copy this template** to your bolt.new session
2. **Customize the [feature] placeholders** with your specific feature names
3. **Update the database schema** with your specific tables
4. **Modify the route templates** for your specific business logic
5. **Generate the backend** using the provided prompt
6. **Test the API** endpoints
7. **Integrate with your frontend**

---

**Template Version**: 1.0  
**Last Updated**: September 2025  
**Compatibility**: Node.js 18+, PostgreSQL 14+, TypeScript 5+
