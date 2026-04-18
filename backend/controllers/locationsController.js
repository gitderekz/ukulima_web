import { db } from '.././models/index.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// Get all locations
export const getAllLocations = async (req, res) => {
  try {
    const locations = await db.Location.findAll({
      include: [
        {
          model: db.Location,
          as: 'children',
          attributes: ['id', 'name', 'type', 'code'],
        },
      ],
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      data: locations,
      total: locations.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch locations',
      error: error.message,
    });
  }
};

// Get location by ID
export const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await db.Location.findByPk(id, {
      include: [
        {
          model: db.Location,
          as: 'children',
          attributes: ['id', 'name', 'type', 'code'],
        },
        {
          model: db.Location,
          as: 'parent',
          attributes: ['id', 'name', 'type'],
        },
      ],
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }

    res.json({
      success: true,
      data: location,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch location',
      error: error.message,
    });
  }
};

// Get locations by type
export const getLocationsByType = async (req, res) => {
  try {
    const { type } = req.params;

    const locations = await db.Location.findAll({
      where: { type },
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      data: locations,
      total: locations.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch locations by type',
      error: error.message,
    });
  }
};

// Get locations for buyer cpp & zone
export const getLocationPath = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await db.Location.findByPk(id, {
      include: [
        {
          model: db.Location,
          as: 'parent',
        },
      ],
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }

    // CPP is current node if type is cpp
    let cpp = null;
    let zone = null;

    if (location.type === 'cpp') {
      cpp = location.name;

      if (location.parent?.type === 'zone') {
        zone = location.parent.name;
      }
    }

    // If location is deeper (region/district/etc), climb up recursively
    let current = location;

    while (current?.parentId) {
      const parent = await db.Location.findByPk(current.parentId);

      if (!parent) break;

      if (parent.type === 'cpp' && !cpp) cpp = parent.name;
      if (parent.type === 'zone' && !zone) zone = parent.name;

      current = parent;
    }

    return res.json({
      success: true,
      data: {
        cpp,
        zone,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get location path',
      error: error.message,
    });
  }
};

//Get full locations of all parents up to root (country)
export const getFullLocationPath = async (req, res) => {
  try {
    const { id } = req.params;

    let current = await db.Location.findByPk(id);

    if (!current) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }

    const result = {};

    // walk up the tree
    while (current) {
      if (current.type) {
        result[current.type] = current.name;
      }

      if (!current.parentId) break;

      current = await db.Location.findByPk(current.parentId);
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch location path',
      error: error.message,
    });
  }
};

// Get child locations
export const getChildLocations = async (req, res) => {
  try {
    const { parentId } = req.params;

    const locations = await db.Location.findAll({
      where: { parentId },
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      data: locations,
      total: locations.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch child locations',
      error: error.message,
    });
  }
};

// Create location
export const createLocation = async (req, res) => {
  try {
    const { name, type, code, parentId } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Name and type are required',
      });
    }

    // Check if code already exists (if provided)
    if (code) {
      const existingLocation = await db.Location.findOne({ where: { code } });
      if (existingLocation) {
        return res.status(400).json({
          success: false,
          message: 'Location with this code already exists',
        });
      }
    }

    const newLocation = await db.Location.create({
      id: uuidv4(),
      name,
      type,
      code: code || null,
      parentId: parentId || null,
    });

    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: newLocation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create location',
      error: error.message,
    });
  }
};

// Update location
export const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, code, parentId } = req.body;

    const location = await db.Location.findByPk(id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }

    // Check if code is being changed and already exists
    if (code && code !== location.code) {
      const existingLocation = await db.Location.findOne({
        where: { code, id: { [Op.ne]: id } },
      });
      if (existingLocation) {
        return res.status(400).json({
          success: false,
          message: 'Another location with this code already exists',
        });
      }
    }

    await location.update({
      name: name || location.name,
      type: type || location.type,
      code: code !== undefined ? code : location.code,
      parentId: parentId !== undefined ? parentId : location.parentId,
    });

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: location,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update location',
      error: error.message,
    });
  }
};

// Delete location
export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await db.Location.findByPk(id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }

    await location.destroy();

    res.json({
      success: true,
      message: 'Location deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete location',
      error: error.message,
    });
  }
};