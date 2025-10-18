import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Hardcoded passcode for delete operations
const DELETE_PASSCODE = 'MNR_DELETE_2024';

// JWT Secret (should be in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// Extend Request type to include user information
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
  passcode?: string;
}

// Middleware to authenticate user via JWT
export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required', message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Authentication failed', message: 'Invalid token' });
  }
};

// Middleware to verify delete passcode
export const verifyDeletePasscode = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { passcode } = req.body;

  if (!passcode) {
    return res.status(400).json({ error: 'Passcode required', message: 'Please provide the delete passcode.' });
  }

  if (passcode !== DELETE_PASSCODE) {
    return res.status(403).json({ error: 'Invalid passcode', message: 'The provided passcode is incorrect.' });
  }

  req.passcode = passcode; // Store passcode for audit if needed
  next();
};

// Utility to get client IP address
export const getClientIP = (req: Request): string | undefined => {
  return req.headers['x-forwarded-for'] as string || req.socket.remoteAddress;
};

// Utility to log audit actions
export const logAuditAction = async (
  action: string,
  entityType: string,
  entityId: string,
  userId: string,
  oldValues: any | null,
  newValues: any | null,
  clientIntakeId: string | null,
  req: Request
) => {
  try {
    await prisma.auditLog.create({
      data: {
        action: action as any,
        entityType,
        entityId,
        oldValues: oldValues ? JSON.stringify(oldValues) : undefined,
        newValues: newValues ? JSON.stringify(newValues) : undefined,
        userId,
        clientIntakeId,
        ipAddress: req?.ip || req?.connection?.remoteAddress,
        userAgent: req?.get('User-Agent')
      }
    });
  } catch (error) {
    console.error('Error logging audit action:', error);
  }
};