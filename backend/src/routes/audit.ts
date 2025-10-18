import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/audit/logs - Get audit logs with filtering
router.get('/logs', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      page = '1',
      limit = '50',
      action,
      entityType,
      userId,
      startDate,
      endDate,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};
    
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (userId) where.userId = userId;
    
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate as string);
      if (endDate) where.timestamp.lte = new Date(endDate as string);
    }

    const [auditLogs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              username: true,
              fullName: true,
              role: true
            }
          },
          clientIntake: {
            select: {
              id: true,
              legalName: true,
              email: true
            }
          }
        },
        orderBy: {
          [sortBy as string]: sortOrder as 'asc' | 'desc'
        },
        skip,
        take: limitNum
      }),
      prisma.auditLog.count({ where })
    ]);

    res.json({
      success: true,
      data: auditLogs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ 
      error: 'Failed to fetch audit logs',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/audit/stats - Get audit statistics
router.get('/stats', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const [
      totalLogs,
      actionStats,
      userStats,
      recentActivity
    ] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.groupBy({
        by: ['action'],
        _count: {
          action: true
        }
      }),
      prisma.auditLog.groupBy({
        by: ['userId'],
        _count: {
          userId: true
        },
        orderBy: {
          _count: {
            userId: 'desc'
          }
        },
        take: 10
      }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: {
          timestamp: 'desc'
        },
        include: {
          user: {
            select: {
              username: true,
              fullName: true
            }
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalLogs,
        actionStats,
        userStats,
        recentActivity
      }
    });

  } catch (error) {
    console.error('Error fetching audit stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch audit statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
