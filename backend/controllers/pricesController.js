import { db } from '.././models/index.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// Get all crop-grade prices
export const getAllPrices = async (req, res) => {
  try {
    const prices = await db.CropGradePrice.findAll({
      include: [
        {
          model: db.Crop,
          attributes: ['id', 'name', 'code'],
        },
        {
          model: db.Grade,
          attributes: ['id', 'name', 'code'],
        },
      ],
      order: [
        [db.Crop, 'name', 'ASC'],
        [db.Grade, 'name', 'ASC'],
        ['effectiveDate', 'DESC'],
      ],
    });

    res.json({
      success: true,
      data: prices,
      total: prices.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prices',
      error: error.message,
    });
  }
};

// Get price by ID
export const getPriceById = async (req, res) => {
  try {
    const { id } = req.params;

    const price = await db.Price.findByPk(id, {
      include: [
        {
          model: db.Crop,
          attributes: ['id', 'name', 'code', 'description'],
        },
        {
          model: db.Grade,
          attributes: ['id', 'name', 'code', 'description'],
        },
      ],
    });

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Price not found',
      });
    }

    res.json({
      success: true,
      data: price,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch price',
      error: error.message,
    });
  }
};

// Get current price for crop-grade combination
export const getCurrentPrice = async (req, res) => {
  try {
    const { cropId, gradeId } = req.params;

    const price = await db.Price.findOne({
      where: {
        cropId,
        gradeId,
        effectiveDate: {
          [Op.lte]: new Date(),
        },
      },
      include: [
        {
          model: db.Crop,
          attributes: ['id', 'name', 'code'],
        },
        {
          model: db.Grade,
          attributes: ['id', 'name', 'code'],
        },
      ],
      order: [['effectiveDate', 'DESC']],
    });

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'No current price found for this crop-grade combination',
      });
    }

    res.json({
      success: true,
      data: price,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch current price',
      error: error.message,
    });
  }
};

// Create price
export const createPrice = async (req, res) => {
  try {
    const { cropId, gradeId, price, effectiveDate } = req.body;

    if (!cropId || !gradeId || price == null) {
      return res.status(400).json({
        success: false,
        message: 'Crop ID, grade ID, and price are required',
      });
    }

    // Verify crop exists
    const crop = await db.Crop.findByPk(cropId);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found',
      });
    }

    // Verify grade exists
    const grade = await db.Grade.findByPk(gradeId);
    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found',
      });
    }

    const newPrice = await db.Price.create({
      id: uuidv4(),
      cropId,
      gradeId,
      price,
      effectiveDate: effectiveDate ? new Date(effectiveDate) : new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Price created successfully',
      data: newPrice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create price',
      error: error.message,
    });
  }
};

// Update price
export const updatePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, effectiveDate, cropId, gradeId } = req.body;

    const priceRecord = await db.Price.findByPk(id);

    if (!priceRecord) {
      return res.status(404).json({
        success: false,
        message: 'Price not found',
      });
    }

    // Verify crop exists if being changed
    if (cropId && cropId !== priceRecord.cropId) {
      const crop = await db.Crop.findByPk(cropId);
      if (!crop) {
        return res.status(404).json({
          success: false,
          message: 'Crop not found',
        });
      }
    }

    // Verify grade exists if being changed
    if (gradeId && gradeId !== priceRecord.gradeId) {
      const grade = await db.Grade.findByPk(gradeId);
      if (!grade) {
        return res.status(404).json({
          success: false,
          message: 'Grade not found',
        });
      }
    }

    await priceRecord.update({
      price: price !== undefined ? price : priceRecord.price,
      effectiveDate: effectiveDate ? new Date(effectiveDate) : priceRecord.effectiveDate,
      cropId: cropId || priceRecord.cropId,
      gradeId: gradeId || priceRecord.gradeId,
    });

    res.json({
      success: true,
      message: 'Price updated successfully',
      data: priceRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update price',
      error: error.message,
    });
  }
};

// Delete price
export const deletePrice = async (req, res) => {
  try {
    const { id } = req.params;

    const price = await db.Price.findByPk(id);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Price not found',
      });
    }

    await price.destroy();

    res.json({
      success: true,
      message: 'Price deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete price',
      error: error.message,
    });
  }
};
