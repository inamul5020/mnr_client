"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// GET /api/departments - List all active departments
router.get('/', async (req, res) => {
    try {
        const departments = await prisma.department.findMany({
            where: { isActive: true },
            include: {
                _count: {
                    select: { staff: true }
                }
            },
            orderBy: { name: 'asc' }
        });
        res.json(departments);
    }
    catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
});
// GET /api/departments/all - List all departments (including inactive)
router.get('/all', async (req, res) => {
    try {
        const departments = await prisma.department.findMany({
            include: {
                _count: {
                    select: { staff: true }
                }
            },
            orderBy: { name: 'asc' }
        });
        res.json(departments);
    }
    catch (error) {
        console.error('Error fetching all departments:', error);
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
});
// POST /api/departments - Create department (admin only)
router.post('/', async (req, res) => {
    try {
        const { name, description, isActive = true } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Department name is required' });
        }
        // Check if department already exists
        const existingDepartment = await prisma.department.findUnique({
            where: { name }
        });
        if (existingDepartment) {
            return res.status(400).json({ error: 'Department with this name already exists' });
        }
        const department = await prisma.department.create({
            data: {
                name,
                description,
                isActive
            },
            include: {
                _count: {
                    select: { staff: true }
                }
            }
        });
        res.status(201).json(department);
    }
    catch (error) {
        console.error('Error creating department:', error);
        res.status(500).json({ error: 'Failed to create department' });
    }
});
// PUT /api/departments/:id - Update department (admin only)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, isActive } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Department name is required' });
        }
        // Check if department exists
        const existingDepartment = await prisma.department.findUnique({
            where: { id }
        });
        if (!existingDepartment) {
            return res.status(404).json({ error: 'Department not found' });
        }
        // Check if name is already taken by another department
        const nameConflict = await prisma.department.findFirst({
            where: {
                name,
                id: { not: id }
            }
        });
        if (nameConflict) {
            return res.status(400).json({ error: 'Department with this name already exists' });
        }
        const department = await prisma.department.update({
            where: { id },
            data: {
                name,
                description,
                isActive
            },
            include: {
                _count: {
                    select: { staff: true }
                }
            }
        });
        res.json(department);
    }
    catch (error) {
        console.error('Error updating department:', error);
        res.status(500).json({ error: 'Failed to update department' });
    }
});
// DELETE /api/departments/:id - Soft delete department (admin only)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Check if department exists
        const existingDepartment = await prisma.department.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { staff: true }
                }
            }
        });
        if (!existingDepartment) {
            return res.status(404).json({ error: 'Department not found' });
        }
        // Check if department has staff members
        if (existingDepartment._count.staff > 0) {
            return res.status(400).json({
                error: 'Cannot delete department with staff members. Please reassign staff first.'
            });
        }
        // Soft delete by setting isActive to false
        const department = await prisma.department.update({
            where: { id },
            data: { isActive: false }
        });
        res.json({ message: 'Department deleted successfully', department });
    }
    catch (error) {
        console.error('Error deleting department:', error);
        res.status(500).json({ error: 'Failed to delete department' });
    }
});
exports.default = router;
//# sourceMappingURL=department.js.map