import bcrypt from 'bcryptjs';
import { db } from '.././models/index.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: db.Role,
          attributes: ['id', 'name', 'description'],
        },
        {
          model: db.Location,
          attributes: ['id', 'name', 'type'],
        },
        {
          model: db.Warehouse,
          attributes: ['id', 'name', 'code'],
        },
      ],
      order: [['firstName', 'ASC'], ['lastName', 'ASC']],
    });

    res.json({
      success: true,
      data: users,
      total: users.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.User.findByPk(id, {
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: db.Role,
          attributes: ['id', 'name', 'description'],
        },
        {
          model: db.Location,
          attributes: ['id', 'name', 'type'],
        },
        {
          model: db.Warehouse,
          attributes: ['id', 'name', 'code'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
};

// Get users by role
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    const users = await db.User.findAll({
      where: { role },
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: db.Role,
          attributes: ['id', 'name', 'description'],
        },
      ],
      order: [['firstName', 'ASC'], ['lastName', 'ASC']],
    });

    res.json({
      success: true,
      data: users,
      total: users.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users by role',
      error: error.message,
    });
  }
};

// Create user
export const createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      roleId,
      locationId,
      warehouseId,
    } = req.body;

    if (!username || !email || !password || !firstName || !lastName || !roleId) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, password, first name, last name, and role are required',
      });
    }

    // Check if username already exists
    const existingUser = await db.User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists',
      });
    }

    // Check if email already exists
    const existingEmail = await db.User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    // Verify role exists
    const role = await db.Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    // Verify location exists if provided
    if (locationId) {
      const location = await db.Location.findByPk(locationId);
      if (!location) {
        return res.status(404).json({
          success: false,
          message: 'Location not found',
        });
      }
    }

    // Verify warehouse exists if provided
    if (warehouseId) {
      const warehouse = await db.Warehouse.findByPk(warehouseId);
      if (!warehouse) {
        return res.status(404).json({
          success: false,
          message: 'Warehouse not found',
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.User.create({
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      roleId,
      locationId: locationId || null,
      warehouseId: warehouseId || null,
      active: true,
    });

    // Remove password from response
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message,
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, firstName, lastName, roleId, locationId, warehouseId, active } = req.body;

    const user = await db.User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if username is being changed and already exists
    if (username && username !== user.username) {
      const existingUser = await db.User.findOne({
        where: { username, id: { [Op.ne]: id } },
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Another user with this username already exists',
        });
      }
    }

    // Check if email is being changed and already exists
    if (email && email !== user.email) {
      const existingEmail = await db.User.findOne({
        where: { email, id: { [Op.ne]: id } },
      });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Another user with this email already exists',
        });
      }
    }

    // Verify role exists if being changed
    if (roleId && roleId !== user.roleId) {
      const role = await db.Role.findByPk(roleId);
      if (!role) {
        return res.status(404).json({
          success: false,
          message: 'Role not found',
        });
      }
    }

    // Verify location exists if being changed
    if (locationId && locationId !== user.locationId) {
      const location = await db.Location.findByPk(locationId);
      if (!location) {
        return res.status(404).json({
          success: false,
          message: 'Location not found',
        });
      }
    }

    // Verify warehouse exists if being changed
    if (warehouseId && warehouseId !== user.warehouseId) {
      const warehouse = await db.Warehouse.findByPk(warehouseId);
      if (!warehouse) {
        return res.status(404).json({
          success: false,
          message: 'Warehouse not found',
        });
      }
    }

    // Hash new password if provided
    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await user.update({
      username: username || user.username,
      email: email || user.email,
      password: hashedPassword,
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      roleId: roleId || user.roleId,
      locationId: locationId !== undefined ? locationId : user.locationId,
      warehouseId: warehouseId !== undefined ? warehouseId : user.warehouseId,
      active: active !== undefined ? active : user.active,
    });

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'User updated successfully',
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};
