"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAuditAction = exports.getClientIP = exports.verifyDeletePasscode = exports.authenticateUser = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
// Hardcoded passcode for delete operations
const DELETE_PASSCODE = 'MNR_DELETE_2024';
// JWT Secret (should be in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
// Middleware to authenticate user via JWT
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required', message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Authentication failed', message: 'Invalid token' });
    }
};
exports.authenticateUser = authenticateUser;
// Middleware to verify delete passcode
const verifyDeletePasscode = (req, res, next) => {
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
exports.verifyDeletePasscode = verifyDeletePasscode;
// Utility to get client IP address
const getClientIP = (req) => {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
};
exports.getClientIP = getClientIP;
// Utility to log audit actions
const logAuditAction = async (action, entityType, entityId, userId, oldValues, newValues, clientIntakeId, req) => {
    try {
        await prisma.auditLog.create({
            data: {
                action: action,
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
    }
    catch (error) {
        console.error('Error logging audit action:', error);
    }
};
exports.logAuditAction = logAuditAction;
//# sourceMappingURL=auth.js.map