"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// GET /api/audit/logs - Get audit logs with filtering
router.get('/logs', auth_1.authenticateUser, async (req, res) => {
    try {
        const { page = '1', limit = '50', action, entityType, userId, startDate, endDate, sortBy = 'timestamp', sortOrder = 'desc' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Build where clause
        const where = {};
        if (action)
            where.action = action;
        if (entityType)
            where.entityType = entityType;
        if (userId)
            where.userId = userId;
        if (startDate || endDate) {
            where.timestamp = {};
            if (startDate)
                where.timestamp.gte = new Date(startDate);
            if (endDate)
                where.timestamp.lte = new Date(endDate);
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
                    [sortBy]: sortOrder
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
    }
    catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({
            error: 'Failed to fetch audit logs',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// GET /api/audit/stats - Get audit statistics
router.get('/stats', auth_1.authenticateUser, async (req, res) => {
    try {
        const [totalLogs, actionStats, userStats, recentActivity] = await Promise.all([
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
    }
    catch (error) {
        console.error('Error fetching audit stats:', error);
        res.status(500).json({
            error: 'Failed to fetch audit statistics',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=audit.js.map