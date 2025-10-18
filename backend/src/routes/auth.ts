import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser, logAuditAction, AuthenticatedRequest } from '../middleware/auth';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// POST /api/auth/login - User login
router.post('/login', async (req: AuthenticatedRequest, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    // Hardcoded users for authentication
    const HARDCODED_USERS = [
      {
        username: 'admin',
        password: 'admin123',
        fullName: 'System Administrator',
        role: 'ADMIN'
      },
      {
        username: 'manager',
        password: 'manager123',
        fullName: 'John Manager',
        role: 'MANAGER'
      },
      {
        username: 'staff1',
        password: 'staff123',
        fullName: 'Sarah Staff',
        role: 'STAFF'
      },
      {
        username: 'staff2',
        password: 'staff456',
        fullName: 'Mike Staff',
        role: 'STAFF'
      }
    ];

    const user = HARDCODED_USERS.find(u => u.username === username && u.password === password);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Username or password is incorrect' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.username, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Log login action
    await logAuditAction(
      'VIEW',
      'User',
      user.username,
      user.username,
      null,
      { action: 'LOGIN', username: user.username },
      null,
      req
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.username,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      message: 'Internal server error during login' 
    });
  }
});

// GET /api/auth/users - Get all users (for admin dashboard)
router.get('/users', async (req, res) => {
  try {
    const HARDCODED_USERS = [
      {
        id: 'admin',
        username: 'admin',
        fullName: 'System Administrator',
        role: 'ADMIN',
        isActive: true
      },
      {
        id: 'manager',
        username: 'manager',
        fullName: 'John Manager',
        role: 'MANAGER',
        isActive: true
      },
      {
        id: 'staff1',
        username: 'staff1',
        fullName: 'Sarah Staff',
        role: 'STAFF',
        isActive: true
      },
      {
        id: 'staff2',
        username: 'staff2',
        fullName: 'Mike Staff',
        role: 'STAFF',
        isActive: true
      }
    ];

    res.json({
      success: true,
      data: HARDCODED_USERS
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      error: 'Failed to fetch users',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
