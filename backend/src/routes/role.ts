import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/roles - List all roles
router.get('/', async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        _count: {
          select: { staffRoles: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// POST /api/roles - Create role (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, type, description } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: 'Role name and type are required' });
    }

    // Check if role already exists
    const existingRole = await prisma.role.findFirst({
      where: {
        OR: [
          { name },
          { type }
        ]
      }
    });

    if (existingRole) {
      if (existingRole.name === name) {
        return res.status(400).json({ error: 'Role with this name already exists' });
      }
      if (existingRole.type === type) {
        return res.status(400).json({ error: 'Role with this type already exists' });
      }
    }

    const role = await prisma.role.create({
      data: {
        name,
        type,
        description
      },
      include: {
        _count: {
          select: { staffRoles: true }
        }
      }
    });

    res.status(201).json(role);
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Failed to create role' });
  }
});

// PUT /api/roles/:id - Update role (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, description } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: 'Role name and type are required' });
    }

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id }
    });

    if (!existingRole) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Check if name or type is already taken by another role
    const conflict = await prisma.role.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              { name },
              { type }
            ]
          }
        ]
      }
    });

    if (conflict) {
      if (conflict.name === name) {
        return res.status(400).json({ error: 'Role with this name already exists' });
      }
      if (conflict.type === type) {
        return res.status(400).json({ error: 'Role with this type already exists' });
      }
    }

    const role = await prisma.role.update({
      where: { id },
      data: {
        name,
        type,
        description
      },
      include: {
        _count: {
          select: { staffRoles: true }
        }
      }
    });

    res.json(role);
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// DELETE /api/roles/:id - Delete role (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id },
      include: {
        _count: {
          select: { staffRoles: true }
        }
      }
    });

    if (!existingRole) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Check if role is assigned to any staff members
    if (existingRole._count.staffRoles > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete role that is assigned to staff members. Please reassign staff first.' 
      });
    }

    // Hard delete the role
    await prisma.role.delete({
      where: { id }
    });

    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Failed to delete role' });
  }
});

export default router;
