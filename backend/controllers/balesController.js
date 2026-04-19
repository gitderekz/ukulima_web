import { db } from '../models/index.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// Get all bales
export const getAllBales = async (req, res) => {
  try {
    const { status, purchaseId } = req.query;

    const where = {};
    if (status) where.status = status;
    if (purchaseId) where.purchaseId = purchaseId;

    const bales = await db.Bale.findAll({
      where,
      include: [
        {
          model: db.Crop,
          attributes: ['id', 'name', 'code'],
        },
        {
          model: db.Grade,
          attributes: ['id', 'name', 'code'],
        },
        {
          model: db.Warehouse,
          attributes: ['id', 'name', 'code'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: bales,
      total: bales.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bales',
      error: error.message,
    });
  }
};

// Get available bales (purchased but not rebaled)
export const getAvailableBales = async (req, res) => {
  try {
    const bales = await db.Bale.findAll({
      where: {
        status: 'purchased',
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
        {
          model: db.Warehouse,
          attributes: ['id', 'name', 'code'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: bales,
      total: bales.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available bales',
      error: error.message,
    });
  }
};

// Get bale by ID
export const getBaleById = async (req, res) => {
  try {
    const { id } = req.params;

    const bale = await db.Bale.findByPk(id, {
      include: [
        {
          model: db.Crop,
          attributes: ['id', 'name', 'code'],
        },
        {
          model: db.Grade,
          attributes: ['id', 'name', 'code'],
        },
        {
          model: db.Warehouse,
          attributes: ['id', 'name', 'code'],
        },
      ],
    });

    if (!bale) {
      return res.status(404).json({
        success: false,
        message: 'Bale not found',
      });
    }

    res.json({
      success: true,
      data: bale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bale',
      error: error.message,
    });
  }
};

// Create bale
export const createBale = async (req, res) => {
  try {
    const { baleTag, cropId, gradeId, mass, price, purchaseId, warehouseId } = req.body;

    if (!baleTag || !cropId || !gradeId || !mass || !price) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
      });
    }

    const totalAmount = mass * price;

    const newBale = await db.Bale.create({
    //   id: uuidv4(),
      baleTag,
      cropId,
      gradeId,
      mass,
      price,
      totalAmount,
      purchaseId,
      warehouseId,
      status: 'purchased',
    });

    res.status(201).json({
      success: true,
      message: 'Bale created successfully',
      data: newBale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create bale',
      error: error.message,
    });
  }
};

// Update bale
export const updateBale = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const bale = await db.Bale.findByPk(id);

    if (!bale) {
      return res.status(404).json({
        success: false,
        message: 'Bale not found',
      });
    }

    await bale.update(updates);

    res.json({
      success: true,
      message: 'Bale updated successfully',
      data: bale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update bale',
      error: error.message,
    });
  }
};

// Delete bale
export const deleteBale = async (req, res) => {
  try {
    const { id } = req.params;

    const bale = await db.Bale.findByPk(id);

    if (!bale) {
      return res.status(404).json({
        success: false,
        message: 'Bale not found',
      });
    }

    await bale.destroy();

    res.json({
      success: true,
      message: 'Bale deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete bale',
      error: error.message,
    });
  }
};