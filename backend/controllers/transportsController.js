import { db } from '.././models/index.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// Get all transports
export const getAllTransports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate) where.transportDate = { [Op.gte]: new Date(startDate) };
    if (endDate) {
      where.transportDate = where.transportDate || {};
      where.transportDate[Op.lte] = new Date(endDate);
    }

    const transports = await db.Transport.findAll({
      where,
      include: [
        {
          model: db.Rebale,
          attributes: ['id', 'rebaleTag', 'totalMass', 'totalAmount'],
        },
        {
          model: db.Location,
          as: 'originLocation',
          attributes: ['id', 'name', 'type'],
        },
        {
          model: db.Location,
          as: 'destinationLocation',
          attributes: ['id', 'name', 'type'],
        },
        {
          model: db.User,
          as: 'buyer',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['transportDate', 'DESC']],
    });

    res.json({
      success: true,
      data: transports,
      total: transports.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transports',
      error: error.message,
    });
  }
};

// Get transport by ID
export const getTransportById = async (req, res) => {
  try {
    const { id } = req.params;

    const transport = await db.Transport.findByPk(id, {
      include: [
        {
          model: db.Rebale,
          attributes: ['id', 'rebaleTag', 'totalMass', 'totalAmount', 'status'],
        },
        {
          model: db.Location,
          as: 'origin',
          attributes: ['id', 'name', 'type', 'code'],
        },
        {
          model: db.Location,
          as: 'destination',
          attributes: ['id', 'name', 'type', 'code'],
        },
        {
          model: db.User,
          attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'phone'],
        },
      ],
    });

    if (!transport) {
      return res.status(404).json({
        success: false,
        message: 'Transport not found',
      });
    }

    res.json({
      success: true,
      data: transport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transport',
      error: error.message,
    });
  }
};

// Create transport
export const createTransport = async (req, res) => {
  try {
    const { rebaleId, driverName, driverPhone, truckPlate1, truckPlate2, originLocationId, destinationLocationId } = req.body;

    if (!rebaleId || !driverName || !driverPhone || !truckPlate1) {
      return res.status(400).json({
        success: false,
        message: 'Rebale ID, driver name, driver phone, and truck plate 1 are required',
      });
    }

    // Verify rebale exists
    const rebale = await db.Rebale.findByPk(rebaleId);
    if (!rebale) {
      return res.status(404).json({
        success: false,
        message: 'Rebale not found',
      });
    }

    // Verify origin and destination locations exist if provided
    if (originLocationId) {
      const origin = await db.Location.findByPk(originLocationId);
      if (!origin) {
        return res.status(404).json({
          success: false,
          message: 'Origin location not found',
        });
      }
    }

    if (destinationLocationId) {
      const destination = await db.Location.findByPk(destinationLocationId);
      if (!destination) {
        return res.status(404).json({
          success: false,
          message: 'Destination location not found',
        });
      }
    }

    const buyerId = req.user.id;
    const receiptNumber = `TRN-${Date.now()}`;

    const newTransport = await db.Transport.create({
      id: uuidv4(),
      receiptNumber,
      rebaleId,
      driverName,
      driverPhone,
      truckPlate1,
      truckPlate2: truckPlate2 || null,
      totalMass: rebale.totalMass,
      totalAmount: rebale.totalAmount,
      buyerId,
      originLocationId: originLocationId || null,
      destinationLocationId: destinationLocationId || null,
      transportDate: new Date(),
      status: 'in_transit',
    });

    // Update rebale status to transported
    await rebale.update({ status: 'transported' });

    res.status(201).json({
      success: true,
      message: 'Transport created successfully',
      data: newTransport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create transport',
      error: error.message,
    });
  }
};

// Update transport
export const updateTransport = async (req, res) => {
  try {
    const { id } = req.params;
    const { driverName, driverPhone, truckPlate1, truckPlate2, status, destinationLocationId, arrivalDate } = req.body;

    const transport = await db.Transport.findByPk(id);

    if (!transport) {
      return res.status(404).json({
        success: false,
        message: 'Transport not found',
      });
    }

    // Verify destination location exists if being changed
    if (destinationLocationId && destinationLocationId !== transport.destinationLocationId) {
      const destination = await db.Location.findByPk(destinationLocationId);
      if (!destination) {
        return res.status(404).json({
          success: false,
          message: 'Destination location not found',
        });
      }
    }

    await transport.update({
      driverName: driverName || transport.driverName,
      driverPhone: driverPhone || transport.driverPhone,
      truckPlate1: truckPlate1 || transport.truckPlate1,
      truckPlate2: truckPlate2 !== undefined ? truckPlate2 : transport.truckPlate2,
      status: status || transport.status,
      destinationLocationId: destinationLocationId !== undefined ? destinationLocationId : transport.destinationLocationId,
      arrivalDate: arrivalDate ? new Date(arrivalDate) : transport.arrivalDate,
    });

    res.json({
      success: true,
      message: 'Transport updated successfully',
      data: transport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update transport',
      error: error.message,
    });
  }
};

// Delete transport
export const deleteTransport = async (req, res) => {
  try {
    const { id } = req.params;

    const transport = await db.Transport.findByPk(id);

    if (!transport) {
      return res.status(404).json({
        success: false,
        message: 'Transport not found',
      });
    }

    await transport.destroy();

    res.json({
      success: true,
      message: 'Transport deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete transport',
      error: error.message,
    });
  }
};

// Get transport statistics
export const getTransportStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate) where.transportDate = { [Op.gte]: new Date(startDate) };
    if (endDate) {
      where.transportDate = where.transportDate || {};
      where.transportDate[Op.lte] = new Date(endDate);
    }

    const transports = await db.Transport.findAll({ where });

    const stats = {
      totalTransports: transports.length,
      totalMass: transports.reduce((sum, t) => sum + (t.totalMass || 0), 0),
      totalAmount: transports.reduce((sum, t) => sum + (t.totalAmount || 0), 0),
      statusBreakdown: {
        in_transit: transports.filter(t => t.status === 'in_transit').length,
        delivered: transports.filter(t => t.status === 'delivered').length,
        cancelled: transports.filter(t => t.status === 'cancelled').length,
      },
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transport statistics',
      error: error.message,
    });
  }
};
