import { db } from '.././models/index.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// Get all roles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await db.Role.findAll({
      include: [
        {
          model: db.User,
          attributes: ['id', 'email', 'firstName', 'lastName'],
        },
      ],
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      data: roles,
      total: roles.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roles',
      error: error.message,
    });
  }
};

// Get role by ID
export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await db.Role.findByPk(id, {
      include: [
        {
          model: db.User,
          attributes: ['id', 'username', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    res.json({
      success: true,
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role',
      error: error.message,
    });
  }
};

// Create role
export const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Role name is required',
      });
    }

    // Check if name already exists
    const existingRole = await db.Role.findOne({ where: { name } });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists',
      });
    }

    const newRole = await db.Role.create({
      id: uuidv4(),
      name,
      description: description || null,
      permissions: permissions ? JSON.stringify(permissions) : null,
    });

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: newRole,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create role',
      error: error.message,
    });
  }
};

// Update role
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions } = req.body;

    const role = await db.Role.findByPk(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    // Check if name is being changed and already exists
    if (name && name !== role.name) {
      const existingRole = await db.Role.findOne({
        where: { name, id: { [Op.ne]: id } },
      });
      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: 'Another role with this name already exists',
        });
      }
    }

    await role.update({
      name: name || role.name,
      description: description !== undefined ? description : role.description,
      permissions: permissions !== undefined ? JSON.stringify(permissions) : role.permissions,
    });

    res.json({
      success: true,
      message: 'Role updated successfully',
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update role',
      error: error.message,
    });
  }
};

// Delete role
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await db.Role.findByPk(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    await role.destroy();

    res.json({
      success: true,
      message: 'Role deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete role',
      error: error.message,
    });
  }
};
