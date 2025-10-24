"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Helper function to generate employee ID
const generateEmployeeId = async () => {
    const prefix = 'EMP';
    const year = new Date().getFullYear().toString().slice(-2);
    // Get the count of staff created this year
    const count = await prisma.staff.count({
        where: {
            employeeId: {
                startsWith: `${prefix}${year}`
            }
        }
    });
    const sequence = (count + 1).toString().padStart(4, '0');
    return `${prefix}${year}${sequence}`;
};
// Helper function to generate username from email
const generateUsername = (email) => {
    return email.split('@')[0];
};
// Helper function to generate random password
const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};
// POST /api/staff - Create staff member (with auto user creation)
router.post('/', async (req, res) => {
    try {
        const { employeeId, firstName, lastName, email, phone, photoUrl, departmentId, hireDate, status = 'ACTIVE', resignDate, resignReason, roleIds = [], createUserAccount = true } = req.body;
        // Validate required fields
        if (!firstName || !lastName || !email || !departmentId) {
            return res.status(400).json({
                error: 'First name, last name, email, and department are required'
            });
        }
        // Check if email already exists
        const existingStaff = await prisma.staff.findUnique({
            where: { email }
        });
        if (existingStaff) {
            return res.status(400).json({ error: 'Staff member with this email already exists' });
        }
        // Check if department exists
        const department = await prisma.department.findUnique({
            where: { id: departmentId }
        });
        if (!department) {
            return res.status(400).json({ error: 'Department not found' });
        }
        // Validate roles if provided
        if (roleIds.length > 0) {
            const roles = await prisma.role.findMany({
                where: { id: { in: roleIds } }
            });
            if (roles.length !== roleIds.length) {
                return res.status(400).json({ error: 'One or more roles not found' });
            }
        }
        // Generate employee ID if not provided
        const finalEmployeeId = employeeId || await generateEmployeeId();
        // Check if employee ID already exists
        const existingEmployeeId = await prisma.staff.findUnique({
            where: { employeeId: finalEmployeeId }
        });
        if (existingEmployeeId) {
            return res.status(400).json({ error: 'Employee ID already exists' });
        }
        let userId = null;
        let userCredentials = null;
        // Create user account if requested
        if (createUserAccount) {
            const username = generateUsername(email);
            const password = generatePassword();
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            try {
                const user = await prisma.user.create({
                    data: {
                        username,
                        password: hashedPassword,
                        fullName: `${firstName} ${lastName}`,
                        role: 'STAFF'
                    }
                });
                userId = user.id;
                userCredentials = {
                    username,
                    password,
                    email
                };
            }
            catch (userError) {
                console.error('Error creating user account:', userError);
                return res.status(500).json({
                    error: 'Failed to create user account. Please try again.'
                });
            }
        }
        // Create staff member
        const staff = await prisma.staff.create({
            data: {
                employeeId: finalEmployeeId,
                firstName,
                lastName,
                email,
                phone,
                photoUrl,
                departmentId,
                hireDate: hireDate ? new Date(hireDate) : new Date(),
                status,
                resignDate: resignDate ? new Date(resignDate) : null,
                resignReason,
                userId
            },
            include: {
                department: true,
                user: true,
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });
        // Assign roles if provided
        if (roleIds.length > 0) {
            await prisma.staffRole.createMany({
                data: roleIds.map((roleId) => ({
                    staffId: staff.id,
                    roleId
                }))
            });
            // Fetch updated staff with roles
            const updatedStaff = await prisma.staff.findUnique({
                where: { id: staff.id },
                include: {
                    department: true,
                    user: true,
                    roles: {
                        include: {
                            role: true
                        }
                    }
                }
            });
            return res.status(201).json({
                staff: updatedStaff,
                userCredentials
            });
        }
        res.status(201).json({
            staff,
            userCredentials
        });
    }
    catch (error) {
        console.error('Error creating staff member:', error);
        res.status(500).json({ error: 'Failed to create staff member' });
    }
});
// GET /api/staff - List all staff with filters
router.get('/', async (req, res) => {
    try {
        const { search, department, status, role, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        // Build where clause
        const where = {};
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { employeeId: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (department) {
            where.departmentId = department;
        }
        if (status) {
            where.status = status;
        }
        if (role) {
            where.roles = {
                some: {
                    roleId: role
                }
            };
        }
        const [staff, total] = await Promise.all([
            prisma.staff.findMany({
                where,
                include: {
                    department: true,
                    user: true,
                    roles: {
                        include: {
                            role: true
                        }
                    }
                },
                orderBy: {
                    [sortBy]: sortOrder
                },
                skip,
                take
            }),
            prisma.staff.count({ where })
        ]);
        res.json({
            staff,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ error: 'Failed to fetch staff' });
    }
});
// GET /api/staff/:id - Get single staff details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await prisma.staff.findUnique({
            where: { id },
            include: {
                department: true,
                user: true,
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });
        if (!staff) {
            return res.status(404).json({ error: 'Staff member not found' });
        }
        res.json(staff);
    }
    catch (error) {
        console.error('Error fetching staff member:', error);
        res.status(500).json({ error: 'Failed to fetch staff member' });
    }
});
// PUT /api/staff/:id - Update staff member
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone, photoUrl, departmentId, hireDate, status, resignDate, resignReason, roleIds } = req.body;
        // Check if staff exists
        const existingStaff = await prisma.staff.findUnique({
            where: { id }
        });
        if (!existingStaff) {
            return res.status(404).json({ error: 'Staff member not found' });
        }
        // Check if email is being changed and already exists
        if (email && email !== existingStaff.email) {
            const emailExists = await prisma.staff.findUnique({
                where: { email }
            });
            if (emailExists) {
                return res.status(400).json({ error: 'Email already exists' });
            }
        }
        // Check if department exists
        if (departmentId) {
            const department = await prisma.department.findUnique({
                where: { id: departmentId }
            });
            if (!department) {
                return res.status(400).json({ error: 'Department not found' });
            }
        }
        // Update staff member
        const updatedStaff = await prisma.staff.update({
            where: { id },
            data: {
                firstName,
                lastName,
                email,
                phone,
                photoUrl,
                departmentId,
                hireDate: hireDate ? new Date(hireDate) : undefined,
                status,
                resignDate: resignDate ? new Date(resignDate) : null,
                resignReason
            },
            include: {
                department: true,
                user: true,
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });
        // Update roles if provided
        if (roleIds !== undefined) {
            // Remove existing roles
            await prisma.staffRole.deleteMany({
                where: { staffId: id }
            });
            // Add new roles
            if (roleIds.length > 0) {
                await prisma.staffRole.createMany({
                    data: roleIds.map((roleId) => ({
                        staffId: id,
                        roleId
                    }))
                });
            }
            // Fetch updated staff with roles
            const finalStaff = await prisma.staff.findUnique({
                where: { id },
                include: {
                    department: true,
                    user: true,
                    roles: {
                        include: {
                            role: true
                        }
                    }
                }
            });
            return res.json(finalStaff);
        }
        res.json(updatedStaff);
    }
    catch (error) {
        console.error('Error updating staff member:', error);
        res.status(500).json({ error: 'Failed to update staff member' });
    }
});
// DELETE /api/staff/:id - Soft delete staff (set isActive=false)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Check if staff exists
        const existingStaff = await prisma.staff.findUnique({
            where: { id }
        });
        if (!existingStaff) {
            return res.status(404).json({ error: 'Staff member not found' });
        }
        // Soft delete by setting isActive to false
        const staff = await prisma.staff.update({
            where: { id },
            data: { isActive: false }
        });
        res.json({ message: 'Staff member deleted successfully', staff });
    }
    catch (error) {
        console.error('Error deleting staff member:', error);
        res.status(500).json({ error: 'Failed to delete staff member' });
    }
});
// POST /api/staff/:id/roles - Assign roles to staff
router.post('/:id/roles', async (req, res) => {
    try {
        const { id } = req.params;
        const { roleIds } = req.body;
        if (!roleIds || !Array.isArray(roleIds)) {
            return res.status(400).json({ error: 'Role IDs array is required' });
        }
        // Check if staff exists
        const staff = await prisma.staff.findUnique({
            where: { id }
        });
        if (!staff) {
            return res.status(404).json({ error: 'Staff member not found' });
        }
        // Validate roles exist
        const roles = await prisma.role.findMany({
            where: { id: { in: roleIds } }
        });
        if (roles.length !== roleIds.length) {
            return res.status(400).json({ error: 'One or more roles not found' });
        }
        // Create role assignments
        await prisma.staffRole.createMany({
            data: roleIds.map((roleId) => ({
                staffId: id,
                roleId
            })),
            skipDuplicates: true
        });
        // Fetch updated staff with roles
        const updatedStaff = await prisma.staff.findUnique({
            where: { id },
            include: {
                department: true,
                user: true,
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });
        res.json(updatedStaff);
    }
    catch (error) {
        console.error('Error assigning roles:', error);
        res.status(500).json({ error: 'Failed to assign roles' });
    }
});
// DELETE /api/staff/:id/roles/:roleId - Remove role from staff
router.delete('/:id/roles/:roleId', async (req, res) => {
    try {
        const { id, roleId } = req.params;
        // Check if staff exists
        const staff = await prisma.staff.findUnique({
            where: { id }
        });
        if (!staff) {
            return res.status(404).json({ error: 'Staff member not found' });
        }
        // Remove role assignment
        await prisma.staffRole.deleteMany({
            where: {
                staffId: id,
                roleId
            }
        });
        // Fetch updated staff with roles
        const updatedStaff = await prisma.staff.findUnique({
            where: { id },
            include: {
                department: true,
                user: true,
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });
        res.json(updatedStaff);
    }
    catch (error) {
        console.error('Error removing role:', error);
        res.status(500).json({ error: 'Failed to remove role' });
    }
});
exports.default = router;
//# sourceMappingURL=staff.js.map