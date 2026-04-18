import { db } from '.././models/index.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// Get all warehouses
export const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await db.Warehouse.findAll({
      include: [
        {
          model: db.Location,
          attributes: ['id', 'name', 'type'],
        },
      ],
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      data: warehouses,
      total: warehouses.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch warehouses',
      error: error.message,
    });
  }
};

// Get warehouse by ID
export const getWarehouseById = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouse = await db.Warehouse.findByPk(id, {
      include: [
        {
          model: db.Location,
          attributes: ['id', 'name', 'type', 'code'],
        },
      ],
    });

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    res.json({
      success: true,
      data: warehouse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch warehouse',
      error: error.message,
    });
  }
};

// Get warehouses by location
export const getWarehousesByLocation = async (req, res) => {
  try {
    const { locationId } = req.params;

    const warehouses = await db.Warehouse.findAll({
      where: { locationId },
      include: [
        {
          model: db.Location,
          attributes: ['id', 'name', 'type'],
        },
      ],
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      data: warehouses,
      total: warehouses.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch warehouses by location',
      error: error.message,
    });
  }
};

// Create warehouse
export const createWarehouse = async (req, res) => {
  try {
    const { name, code, locationId, capacity } = req.body;

    if (!name || !locationId) {
      return res.status(400).json({
        success: false,
        message: 'Name and location are required',
      });
    }

    // Verify location exists
    const location = await db.Location.findByPk(locationId);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }

    // Check if code already exists (if provided)
    if (code) {
      const existingWarehouse = await db.Warehouse.findOne({ where: { code } });
      if (existingWarehouse) {
        return res.status(400).json({
          success: false,
          message: 'Warehouse with this code already exists',
        });
      }
    }

    const newWarehouse = await db.Warehouse.create({
      id: uuidv4(),
      name,
      code: code || null,
      locationId,
      capacity: capacity || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Warehouse created successfully',
      data: newWarehouse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create warehouse',
      error: error.message,
    });
  }
};

// Update warehouse
export const updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, locationId, capacity } = req.body;

    const warehouse = await db.Warehouse.findByPk(id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    // Verify location exists if being changed
    if (locationId && locationId !== warehouse.locationId) {
      const location = await db.Location.findByPk(locationId);
      if (!location) {
        return res.status(404).json({
          success: false,
          message: 'Location not found',
        });
      }
    }

    // Check if code is being changed and already exists
    if (code && code !== warehouse.code) {
      const existingWarehouse = await db.Warehouse.findOne({
        where: { code, id: { [Op.ne]: id } },
      });
      if (existingWarehouse) {
        return res.status(400).json({
          success: false,
          message: 'Another warehouse with this code already exists',
        });
      }
    }

    await warehouse.update({
      name: name || warehouse.name,
      code: code !== undefined ? code : warehouse.code,
      locationId: locationId || warehouse.locationId,
      capacity: capacity !== undefined ? capacity : warehouse.capacity,
    });

    res.json({
      success: true,
      message: 'Warehouse updated successfully',
      data: warehouse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update warehouse',
      error: error.message,
    });
  }
};

// Delete warehouse
export const deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouse = await db.Warehouse.findByPk(id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    await warehouse.destroy();

    res.json({
      success: true,
      message: 'Warehouse deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete warehouse',
      error: error.message,
    });
  }
};
