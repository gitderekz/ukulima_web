import { db } from '.././models/index.js';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

// Helper function to check if user has access to farmer based on location hierarchy
const hasLocationAccess = async (userLocationId, farmerLocationId) => {
  // Admin can access all
  if (!userLocationId) return true;
  
  // Check if farmer's location is under user's location hierarchy
  const isDescendant = async (parentId, childId) => {
    if (parentId === childId) return true;
    
    const child = await db.Location.findByPk(childId);
    if (!child || !child.parentId) return false;
    
    return isDescendant(parentId, child.parentId);
  };
  
  return isDescendant(userLocationId, farmerLocationId);
};

// GET /api/farmers - Get all farmers with optional location filtering
export const getAllFarmers = async (req, res) => {
  console.log('Imefika farmers');
  
  try {
    const { locationId } = req.query;
    const userLocationId = req.user.locationId;
    
    const whereClause = {};
    
    // Filter by user's location access
    if (locationId) {
      whereClause.locationId = locationId;
    } else if (userLocationId && req.user.role !== 'admin') {
      whereClause.locationId = userLocationId;
    }
    
    const farmers = await db.Farmer.findAll({
      where: whereClause,
      include: [
        {
          model: db.Location,
          as: 'Location',
          attributes: ['id', 'name', 'code'],
        },
        {
          model: db.FarmerLoan,
          as: 'FarmerLoans',
          attributes: ['id', 'totalAmount', 'remainingDebt'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    
    res.json({
      success: true,
      data: farmers,
      total: farmers.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch farmers',
      error: error.message,
    });
  }
};

// GET /api/farmers/search?q=query&locationId=xxx
export const searchFarmers = async (req, res) => {
  try {
    const { q, locationId } = req.query;
    const userLocationId = req.user.locationId;
    const userRole = req.user.role;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: [],
      });
    }

    // 🔽 Get ALL children ONLY (downward traversal)
    const getAllChildLocationIds = async (parentId) => {
      const result = [];

      const traverseDown = async (id) => {
        result.push(id);

        const children = await db.Location.findAll({
          where: { parentId: id },
          attributes: ['id'],
        });

        for (const child of children) {
          await traverseDown(child.id);
        }
      };

      await traverseDown(parentId);

      return result;
    };

    const whereClause = {
      [Op.or]: [
        { firstName: { [Op.like]: `%${q}%` } },
        { lastName: { [Op.like]: `%${q}%` } },
        { code: { [Op.like]: `%${q}%` } },
        { phone: { [Op.like]: `%${q}%` } },
      ],
    };

    let allowedLocationIds = null;

    const searchLocationId = locationId ? Number(locationId) : null;
    const userLocId = userLocationId ? Number(userLocationId) : null;

    if (true/*userRole !== 'admin'*/) {
      // PRIORITY 1: if frontend sends locationId, use it
      if (searchLocationId) {
        allowedLocationIds = await getAllChildLocationIds(searchLocationId);
      }
      // PRIORITY 2: fallback to user location
      else if (userLocId) {
        allowedLocationIds = await getAllChildLocationIds(userLocId);
      }

      // apply ONLY downward hierarchy
      if (allowedLocationIds?.length > 0) {
        whereClause.locationId = {
          [Op.in]: allowedLocationIds,
        };
      }
    }

    const farmers = await db.Farmer.findAll({
      where: whereClause,
      include: [
        {
          model: db.Location,
          as: 'Location',
          attributes: ['id', 'name', 'code', 'type'],
        },
        {
          model: db.FarmerLoan,
          as: 'FarmerLoans',
          attributes: ['id', 'totalAmount', 'remainingDebt'],
        },
      ],
      limit: 20,
      order: [['createdAt', 'DESC']],
    });

    return res.json({
      success: true,
      data: farmers,
    });

  } catch (error) {
    console.error('Search Farmers Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message,
    });
  }
};

// GET /api/farmers/:id
export const getFarmerById = async (req, res) => {
  try {
    const { id } = req.params;
    const farmer = await db.Farmer.findByPk(id, {
      include: [
        {
          model: db.Location,
          as: 'Location',
          attributes: ['id', 'name', 'code'],
        },
        {
          model: db.FarmerLoan,
          as: 'FarmerLoans',
          attributes: ['id', 'loanAmount', 'status', 'createdAt'],
        },
      ],
    });
    
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found',
      });
    }
    
    res.json({
      success: true,
      data: farmer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch farmer',
      error: error.message,
    });
  }
};

// POST /api/farmers - Create a new farmer
export const createFarmer = async (req, res) => {
  try {
    const { firstName, lastName, phone, locationId, email, cppId, extensionId } = req.body;
    
    // Validation
    if (!firstName || !lastName || !phone || !locationId) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: firstName, lastName, phone, locationId',
      });
    }
    
    // Check if location exists
    const location = await db.Location.findByPk(locationId);
    if (!location) {
      return res.status(400).json({
        success: false,
        message: 'Location not found',
      });
    }
    
    // Check if phone already exists
    const existingFarmer = await db.Farmer.findOne({ where: { phone } });
    if (existingFarmer) {
      return res.status(400).json({
        success: false,
        message: 'Farmer with this phone number already exists',
      });
    }
    
    const farmerCode = `FRM-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const farmer = await db.Farmer.create({
      // id: uuidv4(),
      firstName,
      lastName,
      phone,
      email,
      code: farmerCode,
      locationId,
      cppId: cppId || null,
      extensionId: extensionId || null,
      loanBalance: 0,
      totalLoanAmount: 0,
    });
    
    res.status(201).json({
      success: true,
      message: 'Farmer created successfully',
      data: farmer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create farmer',
      error: error.message,
    });
  }
};

// PUT /api/farmers/:id - Update a farmer
export const updateFarmer = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, email, locationId } = req.body;
    
    const farmer = await db.Farmer.findByPk(id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found',
      });
    }
    
    // If phone is being changed, check for duplicates
    if (phone && phone !== farmer.phone) {
      const existingFarmer = await db.Farmer.findOne({ where: { phone } });
      if (existingFarmer) {
        return res.status(400).json({
          success: false,
          message: 'Farmer with this phone number already exists',
        });
      }
    }
    
    // Update farmer
    await farmer.update({
      firstName: firstName || farmer.firstName,
      lastName: lastName || farmer.lastName,
      phone: phone || farmer.phone,
      email: email || farmer.email,
      locationId: locationId || farmer.locationId,
    });
    
    res.json({
      success: true,
      message: 'Farmer updated successfully',
      data: farmer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update farmer',
      error: error.message,
    });
  }
};

// DELETE /api/farmers/:id - Delete a farmer
export const deleteFarmer = async (req, res) => {
  try {
    const { id } = req.params;
    
    const farmer = await db.Farmer.findByPk(id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found',
      });
    }
    
    await farmer.destroy();
    
    res.json({
      success: true,
      message: 'Farmer deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete farmer',
      error: error.message,
    });
  }
};
