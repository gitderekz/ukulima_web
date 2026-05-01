// // import { db } from '.././models/index.js';
// // import { Op } from 'sequelize';
// // import { v4 as uuidv4 } from 'uuid';

// // // Get all transports
// // export const getAllTransports = async (req, res) => {
// //   try {
// //     const { startDate, endDate } = req.query;

// //     const where = {};
// //     if (startDate) where.transportDate = { [Op.gte]: new Date(startDate) };
// //     if (endDate) {
// //       where.transportDate = where.transportDate || {};
// //       where.transportDate[Op.lte] = new Date(endDate);
// //     }

// //     const transports = await db.Transport.findAll({
// //       where,
// //       include: [
// //         {
// //           model: db.Rebale,
// //           attributes: ['id', 'rebaleTag', 'totalMass', 'totalAmount'],
// //         },
// //         {
// //           model: db.Location,
// //           as: 'originLocation',
// //           attributes: ['id', 'name', 'type'],
// //         },
// //         {
// //           model: db.Location,
// //           as: 'destinationLocation',
// //           attributes: ['id', 'name', 'type'],
// //         },
// //         {
// //           model: db.User,
// //           as: 'buyer',
// //           attributes: ['id', 'firstName', 'lastName', 'email'],
// //         },
// //       ],
// //       order: [['transportDate', 'DESC']],
// //     });

// //     res.json({
// //       success: true,
// //       data: transports,
// //       total: transports.length,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to fetch transports',
// //       error: error.message,
// //     });
// //   }
// // };

// // // Get transport by ID
// // export const getTransportById = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const transport = await db.Transport.findByPk(id, {
// //       include: [
// //         {
// //           model: db.Rebale,
// //           attributes: ['id', 'rebaleTag', 'totalMass', 'totalAmount', 'status'],
// //         },
// //         {
// //           model: db.Location,
// //           as: 'origin',
// //           attributes: ['id', 'name', 'type', 'code'],
// //         },
// //         {
// //           model: db.Location,
// //           as: 'destination',
// //           attributes: ['id', 'name', 'type', 'code'],
// //         },
// //         {
// //           model: db.User,
// //           attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'phone'],
// //         },
// //       ],
// //     });

// //     if (!transport) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Transport not found',
// //       });
// //     }

// //     res.json({
// //       success: true,
// //       data: transport,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to fetch transport',
// //       error: error.message,
// //     });
// //   }
// // };

// // // Create transport
// // export const createTransport = async (req, res) => {
// //   try {
// //     const { rebaleId, driverName, driverPhone, truckPlate1, truckPlate2, originLocationId, destinationLocationId } = req.body;

// //     if (!rebaleId || !driverName || !driverPhone || !truckPlate1) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Rebale ID, driver name, driver phone, and truck plate 1 are required',
// //       });
// //     }

// //     // Verify rebale exists
// //     const rebale = await db.Rebale.findByPk(rebaleId);
// //     if (!rebale) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Rebale not found',
// //       });
// //     }

// //     // Verify origin and destination locations exist if provided
// //     if (originLocationId) {
// //       const origin = await db.Location.findByPk(originLocationId);
// //       if (!origin) {
// //         return res.status(404).json({
// //           success: false,
// //           message: 'Origin location not found',
// //         });
// //       }
// //     }

// //     if (destinationLocationId) {
// //       const destination = await db.Location.findByPk(destinationLocationId);
// //       if (!destination) {
// //         return res.status(404).json({
// //           success: false,
// //           message: 'Destination location not found',
// //         });
// //       }
// //     }

// //     const buyerId = req.user.id;
// //     const receiptNumber = `TRN-${Date.now()}`;

// //     const newTransport = await db.Transport.create({
// //       id: uuidv4(),
// //       receiptNumber,
// //       rebaleId,
// //       driverName,
// //       driverPhone,
// //       truckPlate1,
// //       truckPlate2: truckPlate2 || null,
// //       totalMass: rebale.totalMass,
// //       totalAmount: rebale.totalAmount,
// //       buyerId,
// //       originLocationId: originLocationId || null,
// //       destinationLocationId: destinationLocationId || null,
// //       transportDate: new Date(),
// //       status: 'in_transit',
// //     });

// //     // Update rebale status to transported
// //     await rebale.update({ status: 'transported' });

// //     res.status(201).json({
// //       success: true,
// //       message: 'Transport created successfully',
// //       data: newTransport,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to create transport',
// //       error: error.message,
// //     });
// //   }
// // };

// // // Update transport
// // export const updateTransport = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { driverName, driverPhone, truckPlate1, truckPlate2, status, destinationLocationId, arrivalDate } = req.body;

// //     const transport = await db.Transport.findByPk(id);

// //     if (!transport) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Transport not found',
// //       });
// //     }

// //     // Verify destination location exists if being changed
// //     if (destinationLocationId && destinationLocationId !== transport.destinationLocationId) {
// //       const destination = await db.Location.findByPk(destinationLocationId);
// //       if (!destination) {
// //         return res.status(404).json({
// //           success: false,
// //           message: 'Destination location not found',
// //         });
// //       }
// //     }

// //     await transport.update({
// //       driverName: driverName || transport.driverName,
// //       driverPhone: driverPhone || transport.driverPhone,
// //       truckPlate1: truckPlate1 || transport.truckPlate1,
// //       truckPlate2: truckPlate2 !== undefined ? truckPlate2 : transport.truckPlate2,
// //       status: status || transport.status,
// //       destinationLocationId: destinationLocationId !== undefined ? destinationLocationId : transport.destinationLocationId,
// //       arrivalDate: arrivalDate ? new Date(arrivalDate) : transport.arrivalDate,
// //     });

// //     res.json({
// //       success: true,
// //       message: 'Transport updated successfully',
// //       data: transport,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to update transport',
// //       error: error.message,
// //     });
// //   }
// // };

// // // Delete transport
// // export const deleteTransport = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const transport = await db.Transport.findByPk(id);

// //     if (!transport) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Transport not found',
// //       });
// //     }

// //     await transport.destroy();

// //     res.json({
// //       success: true,
// //       message: 'Transport deleted successfully',
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to delete transport',
// //       error: error.message,
// //     });
// //   }
// // };

// // // Get transport statistics
// // export const getTransportStats = async (req, res) => {
// //   try {
// //     const { startDate, endDate } = req.query;

// //     const where = {};
// //     if (startDate) where.transportDate = { [Op.gte]: new Date(startDate) };
// //     if (endDate) {
// //       where.transportDate = where.transportDate || {};
// //       where.transportDate[Op.lte] = new Date(endDate);
// //     }

// //     const transports = await db.Transport.findAll({ where });

// //     const stats = {
// //       totalTransports: transports.length,
// //       totalMass: transports.reduce((sum, t) => sum + (t.totalMass || 0), 0),
// //       totalAmount: transports.reduce((sum, t) => sum + (t.totalAmount || 0), 0),
// //       statusBreakdown: {
// //         in_transit: transports.filter(t => t.status === 'in_transit').length,
// //         delivered: transports.filter(t => t.status === 'delivered').length,
// //         cancelled: transports.filter(t => t.status === 'cancelled').length,
// //       },
// //     };

// //     res.json({
// //       success: true,
// //       data: stats,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to fetch transport statistics',
// //       error: error.message,
// //     });
// //   }
// // };
// import { db } from '.././models/index.js';
// import { Op } from 'sequelize';

// // Get all transports
// export const getAllTransports = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;

//     const where = {};
//     if (startDate) where.transportDate = { [Op.gte]: new Date(startDate) };
//     if (endDate) {
//       where.transportDate = where.transportDate || {};
//       where.transportDate[Op.lte] = new Date(endDate);
//     }

//     const transports = await db.Transport.findAll({
//       where,
//       include: [
//         {
//           model: db.Rebale,
//           through: { attributes: [] },
//           attributes: ['id', 'rebaleTag', 'totalMass', 'totalAmount'],
//         },
//         {
//           model: db.Location,
//           as: 'originLocation',
//           attributes: ['id', 'name', 'type'],
//         },
//         {
//           model: db.Location,
//           as: 'destinationLocation',
//           attributes: ['id', 'name', 'type'],
//         },
//         {
//           model: db.User,
//           as: 'buyer',
//           attributes: ['id', 'firstName', 'lastName', 'email'],
//         },
//       ],
//       order: [['transportDate', 'DESC']],
//     });

//     res.json({
//       success: true,
//       data: transports,
//       total: transports.length,
//     });
//   } catch (error) {
//     console.error('Get all transports error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transports',
//       error: error.message,
//     });
//   }
// };

// // Get transport by ID
// export const getTransportById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const transport = await db.Transport.findByPk(id, {
//       include: [
//         {
//           model: db.Rebale,
//           through: { attributes: [] },
//           attributes: ['id', 'rebaleTag', 'totalMass', 'totalAmount', 'status'],
//         },
//         {
//           model: db.Location,
//           as: 'originLocation',
//           attributes: ['id', 'name', 'type', 'code'],
//         },
//         {
//           model: db.Location,
//           as: 'destinationLocation',
//           attributes: ['id', 'name', 'type', 'code'],
//         },
//         {
//           model: db.User,
//           as: 'buyer',
//           attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'phone'],
//         },
//       ],
//     });

//     if (!transport) {
//       return res.status(404).json({
//         success: false,
//         message: 'Transport not found',
//       });
//     }

//     res.json({
//       success: true,
//       data: transport,
//     });
//   } catch (error) {
//     console.error('Get transport by ID error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transport',
//       error: error.message,
//     });
//   }
// };

// // Create transport (supports multiple rebales)
// export const createTransport = async (req, res) => {
//   try {
//     const { 
//       rebaleIds, 
//       driverName, 
//       driverPhone, 
//       truckPlate1, 
//       truckPlate2, 
//       originLocationId, 
//       destinationLocationId,
//       warehouseId 
//     } = req.body;

//     if (!rebaleIds || rebaleIds.length === 0 || !driverName || !driverPhone || !truckPlate1) {
//       return res.status(400).json({
//         success: false,
//         message: 'Rebale IDs array, driver name, driver phone, and truck plate 1 are required',
//       });
//     }

//     // Verify all rebales exist and are in 'stored' status
//     const rebales = await db.Rebale.findAll({
//       where: {
//         id: rebaleIds,
//         status: 'stored'
//       }
//     });

//     if (rebales.length !== rebaleIds.length) {
//       return res.status(400).json({
//         success: false,
//         message: 'Some rebales are not found or are not in stored status',
//       });
//     }

//     // Calculate totals
//     const totalMass = rebales.reduce((sum, r) => sum + parseFloat(r.totalMass), 0);
//     const totalAmount = rebales.reduce((sum, r) => sum + parseFloat(r.totalAmount), 0);

//     const buyerId = req.user.id;
//     const receiptNumber = `TRN-${Date.now()}`;

//     // Create transport
//     const newTransport = await db.Transport.create({
//       receiptNumber,
//       driverName,
//       driverPhone,
//       truckPlate1,
//       truckPlate2: truckPlate2 || null,
//       totalMass,
//       totalAmount,
//       buyerId,
//       warehouseId: warehouseId || null,
//       originLocationId: originLocationId || null,
//       destinationLocationId: destinationLocationId || null,
//       transportDate: new Date(),
//       status: 'in_transit',
//     });

//     // Associate rebales with transport (many-to-many)
//     if (newTransport && rebaleIds.length > 0) {
//       const transportRebaleEntries = rebaleIds.map(rebaleId => ({
//         transportId: newTransport.id,
//         rebaleId: rebaleId,
//       }));
      
//       // You need a TransportRebale junction table for this
//       // For now, let's update each rebale with transportId
//       await db.Rebale.update(
//         { transportId: newTransport.id, status: 'transported' },
//         { where: { id: rebaleIds } }
//       );
//     }

//     // Fetch the created transport with associated rebales
//     const createdTransport = await db.Transport.findByPk(newTransport.id, {
//       include: [
//         {
//           model: db.Rebale,
//           attributes: ['id', 'rebaleTag', 'totalMass', 'totalAmount'],
//         },
//       ],
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Transport created successfully',
//       data: createdTransport,
//     });
//   } catch (error) {
//     console.error('Create transport error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create transport',
//       error: error.message,
//     });
//   }
// };

// // Update transport
// export const updateTransport = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { driverName, driverPhone, truckPlate1, truckPlate2, status, destinationLocationId, arrivalDate } = req.body;

//     const transport = await db.Transport.findByPk(id);

//     if (!transport) {
//       return res.status(404).json({
//         success: false,
//         message: 'Transport not found',
//       });
//     }

//     // Verify destination location exists if being changed
//     if (destinationLocationId && destinationLocationId !== transport.destinationLocationId) {
//       const destination = await db.Location.findByPk(destinationLocationId);
//       if (!destination) {
//         return res.status(404).json({
//           success: false,
//           message: 'Destination location not found',
//         });
//       }
//     }

//     await transport.update({
//       driverName: driverName || transport.driverName,
//       driverPhone: driverPhone || transport.driverPhone,
//       truckPlate1: truckPlate1 || transport.truckPlate1,
//       truckPlate2: truckPlate2 !== undefined ? truckPlate2 : transport.truckPlate2,
//       status: status || transport.status,
//       destinationLocationId: destinationLocationId !== undefined ? destinationLocationId : transport.destinationLocationId,
//       arrivalDate: arrivalDate ? new Date(arrivalDate) : transport.arrivalDate,
//     });

//     res.json({
//       success: true,
//       message: 'Transport updated successfully',
//       data: transport,
//     });
//   } catch (error) {
//     console.error('Update transport error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update transport',
//       error: error.message,
//     });
//   }
// };

// // Delete transport
// export const deleteTransport = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const transport = await db.Transport.findByPk(id);

//     if (!transport) {
//       return res.status(404).json({
//         success: false,
//         message: 'Transport not found',
//       });
//     }

//     // Update associated rebales status back to 'stored'
//     await db.Rebale.update(
//       { transportId: null, status: 'stored' },
//       { where: { transportId: id } }
//     );

//     await transport.destroy();

//     res.json({
//       success: true,
//       message: 'Transport deleted successfully',
//     });
//   } catch (error) {
//     console.error('Delete transport error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete transport',
//       error: error.message,
//     });
//   }
// };

// // Get transport statistics
// export const getTransportStats = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;

//     const where = {};
//     if (startDate) where.transportDate = { [Op.gte]: new Date(startDate) };
//     if (endDate) {
//       where.transportDate = where.transportDate || {};
//       where.transportDate[Op.lte] = new Date(endDate);
//     }

//     const transports = await db.Transport.findAll({ where });

//     const stats = {
//       totalTransports: transports.length,
//       totalMass: transports.reduce((sum, t) => sum + parseFloat(t.totalMass || 0), 0),
//       totalAmount: transports.reduce((sum, t) => sum + parseFloat(t.totalAmount || 0), 0),
//       statusBreakdown: {
//         in_transit: transports.filter(t => t.status === 'in_transit').length,
//         delivered: transports.filter(t => t.status === 'delivered').length,
//         cancelled: transports.filter(t => t.status === 'cancelled').length,
//       },
//     };

//     res.json({
//       success: true,
//       data: stats,
//     });
//   } catch (error) {
//     console.error('Get transport stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch transport statistics',
//       error: error.message,
//     });
//   }
// };
import { db } from '.././models/index.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// Get all transports
export const getAllTransports = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    const where = {};
    if (startDate) where.transportDate = { [Op.gte]: new Date(startDate) };
    if (endDate) {
      where.transportDate = where.transportDate || {};
      where.transportDate[Op.lte] = new Date(endDate);
    }
    if (status) where.status = status;

    const transports = await db.Transport.findAll({
      where,
      include: [
        {
          model: db.Rebale,
          through: { attributes: ['loadedAt'] },
          attributes: ['id', 'rebaleTag', 'totalMass', 'totalAmount', 'cropId', 'gradeId', 'status'],
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
        {
          model: db.Warehouse,
          attributes: ['id', 'name', 'code'],
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
    console.error('Get all transports error:', error);
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
          through: { attributes: ['loadedAt'] },
          attributes: ['id', 'rebaleTag', 'totalMass', 'totalAmount', 'status'],
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
        },
        {
          model: db.Location,
          as: 'originLocation',
          attributes: ['id', 'name', 'type', 'code'],
        },
        {
          model: db.Location,
          as: 'destinationLocation',
          attributes: ['id', 'name', 'type', 'code'],
        },
        {
          model: db.User,
          as: 'buyer',
          attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'phone'],
        },
        {
          model: db.Warehouse,
          attributes: ['id', 'name', 'code'],
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
    console.error('Get transport by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transport',
      error: error.message,
    });
  }
};

// Create transport with proper many-to-many association
export const createTransport = async (req, res) => {
  try {
    const { 
      rebaleIds, 
      driverName, 
      driverPhone, 
      truckPlate1, 
      truckPlate2, 
      originLocationId, 
      destinationLocationId,
      warehouseId 
    } = req.body;

    if (!rebaleIds || rebaleIds.length === 0 || !driverName || !driverPhone || !truckPlate1) {
      return res.status(400).json({
        success: false,
        message: 'Rebale IDs array, driver name, driver phone, and truck plate 1 are required',
      });
    }

    // Verify all rebales exist and are in 'stored' status
    const rebales = await db.Rebale.findAll({
      where: {
        id: rebaleIds,
        status: 'stored'
      }
    });

    if (rebales.length !== rebaleIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some rebales are not found or are not in stored status',
      });
    }

    // Calculate totals
    const totalMass = rebales.reduce((sum, r) => sum + parseFloat(r.totalMass), 0);
    const totalAmount = rebales.reduce((sum, r) => sum + parseFloat(r.totalAmount), 0);

    const buyerId = req.user.id;
    const receiptNumber = `TRN-${Date.now()}`;

    // Create transport
    const newTransport = await db.Transport.create({
      id: uuidv4(),
      receiptNumber,
      driverName,
      driverPhone,
      truckPlate1,
      truckPlate2: truckPlate2 || null,
      totalMass,
      totalAmount,
      buyerId,
      rebaleId:null,
      warehouseId: warehouseId || null,
      originLocationId: originLocationId || null,
      destinationLocationId: destinationLocationId || null,
      transportDate: new Date(),
      status: 'in_transit',
    });

    // Create TransportRebale entries for each rebale
    if (newTransport && rebaleIds.length > 0) {
      const transportRebaleEntries = rebaleIds.map(rebaleId => ({
        id: uuidv4(),
        transportId: newTransport.id,
        rebaleId: rebaleId,
        loadedAt: new Date(),
      }));
      
      await db.TransportRebale.bulkCreate(transportRebaleEntries);
      
      // Update rebales status to 'transported'
      await db.Rebale.update(
        { status: 'transported' },
        { where: { id: rebaleIds } }
      );
    }
    console.log('Transport created with ID:', newTransport.id);
    const x = await db.Transport.findByPk(newTransport.id);
    console.log('Transport created with ID:', x.length);


    // Fetch the created transport with associated rebales
    const createdTransport = await db.Transport.findByPk(newTransport.id, {
      include: [
        {
          model: db.Rebale,
          through: { attributes: ['loadedAt'] },
          attributes: ['id', 'rebaleTag', 'totalMass', 'totalAmount', 'cropId', 'gradeId'],
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
        },
        {
          model: db.Location,
          as: 'originLocation',
          attributes: ['id', 'name'],
        },
        {
          model: db.Location,
          as: 'destinationLocation',
          attributes: ['id', 'name'],
        },
        {
          model: db.User,
          as: 'buyer',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Transport created successfully',
      data: createdTransport,
    });
  } catch (error) {
    console.error('Create transport error:', error);
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

    // If status is delivered, update all associated rebales
    if (status === 'delivered') {
      const transportRebales = await db.TransportRebale.findAll({
        where: { transportId: id },
        attributes: ['rebaleId']
      });
      const rebaleIds = transportRebales.map(tr => tr.rebaleId);
      await db.Rebale.update(
        { status: 'completed' },
        { where: { id: rebaleIds } }
      );
    }

    // Fetch updated transport with associations
    const updatedTransport = await db.Transport.findByPk(id, {
      include: [
        {
          model: db.Rebale,
          through: { attributes: ['loadedAt'] },
          attributes: ['id', 'rebaleTag', 'totalMass', 'totalAmount'],
        },
      ],
    });

    res.json({
      success: true,
      message: 'Transport updated successfully',
      data: updatedTransport,
    });
  } catch (error) {
    console.error('Update transport error:', error);
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

    // Get all rebale IDs associated with this transport
    const transportRebales = await db.TransportRebale.findAll({
      where: { transportId: id },
      attributes: ['rebaleId']
    });
    const rebaleIds = transportRebales.map(tr => tr.rebaleId);

    // Delete TransportRebale entries
    await db.TransportRebale.destroy({ where: { transportId: id } });
    
    // Update rebales status back to 'stored'
    if (rebaleIds.length > 0) {
      await db.Rebale.update(
        { status: 'stored' },
        { where: { id: rebaleIds } }
      );
    }
    
    // Delete the transport
    await transport.destroy();

    res.json({
      success: true,
      message: 'Transport deleted successfully',
    });
  } catch (error) {
    console.error('Delete transport error:', error);
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

    // Get total rebales transported
    const totalRebalesTransported = await db.TransportRebale.count();

    const stats = {
      totalTransports: transports.length,
      totalRebalesTransported,
      totalMass: transports.reduce((sum, t) => sum + parseFloat(t.totalMass || 0), 0),
      totalAmount: transports.reduce((sum, t) => sum + parseFloat(t.totalAmount || 0), 0),
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
    console.error('Get transport stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transport statistics',
      error: error.message,
    });
  }
};