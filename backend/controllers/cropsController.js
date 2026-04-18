import { db } from '.././models/index.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllCrops = async (req, res) => {
  try {
    const crops = await db.Crop.findAll({
      order: [['name', 'ASC']],
    });
    
    res.json({
      success: true,
      data: crops,
      total: crops.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crops',
      error: error.message,
    });
  }
};

export const getCropById = async (req, res) => {
  try {
    const { id } = req.params;
    const crop = await db.Crop.findByPk(id, {
      include: [
        {
          model: db.Price,
          as: 'Prices',
          attributes: ['id', 'gradeId', 'price', 'effectiveDate'],
        },
      ],
    });
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found',
      });
    }
    
    res.json({
      success: true,
      data: crop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop',
      error: error.message,
    });
  }
};

export const createCrop = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    
    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: 'Name and code are required',
      });
    }
    
    // Check if code already exists
    const existingCrop = await db.Crop.findOne({ where: { code } });
    if (existingCrop) {
      return res.status(400).json({
        success: false,
        message: 'Crop with this code already exists',
      });
    }
    
    const newCrop = await db.Crop.create({
      id: uuidv4(),
      name,
      code,
      description: description || null,
    });
    
    res.status(201).json({
      success: true,
      message: 'Crop created successfully',
      data: newCrop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create crop',
      error: error.message,
    });
  }
};

export const updateCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description } = req.body;
    
    const crop = await db.Crop.findByPk(id);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found',
      });
    }
    
    // Check if code is being changed and already exists
    if (code && code !== crop.code) {
      const existingCrop = await db.Crop.findOne({ where: { code } });
      if (existingCrop) {
        return res.status(400).json({
          success: false,
          message: 'Another crop with this code already exists',
        });
      }
    }
    
    await crop.update({
      name: name || crop.name,
      code: code || crop.code,
      description: description !== undefined ? description : crop.description,
    });
    
    res.json({
      success: true,
      message: 'Crop updated successfully',
      data: crop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update crop',
      error: error.message,
    });
  }
};

export const deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;
    
    const crop = await db.Crop.findByPk(id);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found',
      });
    }
    
    await crop.destroy();
    
    res.json({
      success: true,
      message: 'Crop deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete crop',
      error: error.message,
    });
  }
};
