// // import { db } from '.././models/index.js';
// // import { Op } from 'sequelize';
// // import { v4 as uuidv4 } from 'uuid';

// // // Get all rebales
// // export const getAllRebales = async (req, res) => {
// //   try {
// //     const { startDate, endDate, status } = req.query;

// //     const where = {};
// //     if (startDate) where.rebaleDate = { [Op.gte]: new Date(startDate) };
// //     if (endDate) {
// //       where.rebaleDate = where.rebaleDate || {};
// //       where.rebaleDate[Op.lte] = new Date(endDate);
// //     }
// //     if (status) where.status = status;

// //     const rebales = await db.Rebale.findAll({
// //       where,
// //       include: [
// //         {
// //           model: db.Warehouse,
// //           attributes: ['id', 'name', 'code'],
// //         },
// //         {
// //           model: db.User,
// //           attributes: ['id', 'firstName', 'lastName', 'username'],
// //         },
// //         {
// //           model: db.Crop,
// //           attributes: ['id', 'name', 'code'],
// //         },
// //         {
// //           model: db.Grade,
// //           attributes: ['id', 'name', 'code'],
// //         },
// //       ],
// //       order: [['rebaleDate', 'DESC']],
// //     });

// //     res.json({
// //       success: true,
// //       data: rebales,
// //       total: rebales.length,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to fetch rebales',
// //       error: error.message,
// //     });
// //   }
// // };

// // // Get rebale by ID
// // export const getRebaleById = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const rebale = await db.Rebale.findByPk(id, {
// //       include: [
// //         {
// //           model: db.Warehouse,
// //           attributes: ['id', 'name', 'code', 'locationId'],
// //         },
// //         {
// //           model: db.User,
// //           attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
// //         },
// //         {
// //           model: db.Crop,
// //           attributes: ['id', 'name', 'code', 'description'],
// //         },
// //         {
// //           model: db.Grade,
// //           attributes: ['id', 'name', 'code', 'description'],
// //         },
// //         {
// //           model: db.Transport,
// //           attributes: ['id', 'receiptNumber', 'status', 'createdAt'],
// //         },
// //       ],
// //     });

// //     if (!rebale) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Rebale not found',
// //       });
// //     }

// //     res.json({
// //       success: true,
// //       data: rebale,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to fetch rebale',
// //       error: error.message,
// //     });
// //   }
// // };

// // // Create rebale
// // // export const createRebale = async (req, res) => {
// // //   try {
// // //     const { cropId, gradeId, totalMass, price, warehouseId, sourceBaleIds } = req.body;

// // //     if (!cropId || !gradeId || !totalMass || !price) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'Crop ID, grade ID, total mass, and price are required',
// // //       });
// // //     }

// // //     // Verify crop exists
// // //     const crop = await db.Crop.findByPk(cropId);
// // //     if (!crop) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: 'Crop not found',
// // //       });
// // //     }

// // //     // Verify grade exists
// // //     const grade = await db.Grade.findByPk(gradeId);
// // //     if (!grade) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: 'Grade not found',
// // //       });
// // //     }

// // //     // Verify warehouse exists if provided
// // //     if (warehouseId) {
// // //       const warehouse = await db.Warehouse.findByPk(warehouseId);
// // //       if (!warehouse) {
// // //         return res.status(404).json({
// // //           success: false,
// // //           message: 'Warehouse not found',
// // //         });
// // //       }
// // //     }

// // //     const buyerId = req.user.id;
// // //     const totalAmount = totalMass * price;
// // //     const rebaleTag = `RB-${Date.now()}`;

// // //     const newRebale = await db.Rebale.create({
// // //       id: uuidv4(),
// // //       rebaleTag,
// // //       cropId,
// // //       gradeId,
// // //       totalMass,
// // //       price,
// // //       totalAmount,
// // //       warehouseId: warehouseId || req.user.warehouseId || null,
// // //       buyerId,
// // //       sourceBaleIds: sourceBaleIds ? JSON.stringify(sourceBaleIds) : null,
// // //       rebaleDate: new Date(),
// // //       status: 'completed',
// // //     });

// // //     res.status(201).json({
// // //       success: true,
// // //       message: 'Rebale created successfully',
// // //       data: newRebale,
// // //     });
// // //   } catch (error) {
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Failed to create rebale',
// // //       error: error.message,
// // //     });
// // //   }
// // // };
// // // Create rebale
// // export const createRebale = async (req, res) => {
// //   try {
// //     const { cropId, gradeId, totalMass, price, warehouseId, sourceBaleIds } = req.body;

// //     if (!cropId || !gradeId || !totalMass || !price) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Crop ID, grade ID, total mass, and price are required',
// //       });
// //     }

// //     // Verify crop exists
// //     const crop = await db.Crop.findByPk(cropId);
// //     if (!crop) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Crop not found',
// //       });
// //     }

// //     // Verify grade exists
// //     const grade = await db.Grade.findByPk(gradeId);
// //     if (!grade) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Grade not found',
// //       });
// //     }

// //     // Verify warehouse exists if provided
// //     if (warehouseId) {
// //       const warehouse = await db.Warehouse.findByPk(warehouseId);
// //       if (!warehouse) {
// //         return res.status(404).json({
// //           success: false,
// //           message: 'Warehouse not found',
// //         });
// //       }
// //     }

// //     const buyerId = req.user.id;
// //     const totalAmount = totalMass * price;
// //     const rebaleTag = `RB-${Date.now()}`;

// //     const newRebale = await db.Rebale.create({
// //       // id: uuidv4(),
// //       rebaleTag,
// //       cropId,
// //       gradeId,
// //       totalMass,
// //       price,
// //       totalAmount,
// //       warehouseId: warehouseId || req.user.warehouseId || null,
// //       buyerId,
// //       sourceBaleIds: sourceBaleIds || null,
// //       rebaleDate: new Date(),
// //       status: 'stored',
// //     });

// //     // Update source bales if provided
// //     if (sourceBaleIds && sourceBaleIds.length > 0) {
// //       await db.Bale.update(
// //         { status: 'rebaled' },
// //         { where: { id: sourceBaleIds } }
// //       );
// //     }

// //     res.status(201).json({
// //       success: true,
// //       message: 'Rebale created successfully',
// //       data: newRebale,
// //     });
// //   } catch (error) {
// //     console.error('Create rebale error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to create rebale',
// //       error: error.message,
// //     });
// //   }
// // };

// // // Create batch rebales
// // export const createBatchRebales = async (req, res) => {
// //   try {
// //     const { rebales } = req.body;

// //     if (!rebales || rebales.length === 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Rebales array is required',
// //       });
// //     }

// //     const buyerId = req.user.id;
// //     // const buyerId = req.user.dataValues.id;
// //     const receiptNumber = `RB-${Date.now()}`;
// //     const createdRebales = [];
// //     console.log('User: ',req.user.id);
    

// //     for (const rebale of rebales) {
// //       // Verify crop and grade exist
// //       const crop = await db.Crop.findByPk(rebale.cropId);
// //       if (!crop) continue;

// //       const grade = await db.Grade.findByPk(rebale.gradeId);
// //       if (!grade) continue;

// //       const totalAmount = rebale.totalMass * rebale.price;

// //       const created = await db.Rebale.create({
// //         // id: uuidv4(),
// //         rebaleTag: `RB-${Date.now()}-${createdRebales.length}`,
// //         cropId: rebale.cropId,
// //         gradeId: rebale.gradeId,
// //         totalMass: rebale.totalMass,
// //         price: rebale.price,
// //         totalAmount,
// //         buyerId,
// //         warehouseId: rebale.warehouseId || req.user.warehouseId || null,
// //         sourceBaleIds: rebale.sourceBaleIds ? JSON.stringify(rebale.sourceBaleIds) : null,
// //         rebaleDate: new Date(),
// //         status: 'completed',
// //       });

// //       createdRebales.push(created);
// //     }

// //     res.status(201).json({
// //       success: true,
// //       message: 'Batch rebales created successfully',
// //       data: {
// //         receiptNumber,
// //         rebales: createdRebales,
// //       },
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to create batch rebales',
// //       error: error.message,
// //     });
// //   }
// // };

// // // Update rebale status
// // export const updateRebaleStatus = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { status } = req.body;

// //     if (!status) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Status is required',
// //       });
// //     }

// //     const rebale = await db.Rebale.findByPk(id);

// //     if (!rebale) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Rebale not found',
// //       });
// //     }

// //     await rebale.update({ status });

// //     res.json({
// //       success: true,
// //       message: 'Rebale status updated successfully',
// //       data: rebale,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to update rebale status',
// //       error: error.message,
// //     });
// //   }
// // };

// // // Update rebale
// // export const updateRebale = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const updates = req.body;

// //     const rebale = await db.Rebale.findByPk(id);

// //     if (!rebale) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Rebale not found',
// //       });
// //     }

// //     await rebale.update(updates);

// //     res.json({
// //       success: true,
// //       message: 'Rebale updated successfully',
// //       data: rebale,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to update rebale',
// //       error: error.message,
// //     });
// //   }
// // };

// // // Delete rebale
// // export const deleteRebale = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const rebale = await db.Rebale.findByPk(id);

// //     if (!rebale) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Rebale not found',
// //       });
// //     }

// //     await rebale.destroy();

// //     res.json({
// //       success: true,
// //       message: 'Rebale deleted successfully',
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to delete rebale',
// //       error: error.message,
// //     });
// //   }
// // };

// // // Get rebale statistics
// // export const getRebaleStats = async (req, res) => {
// //   try {
// //     const { startDate, endDate } = req.query;

// //     const where = {};
// //     if (startDate) where.rebaleDate = { [Op.gte]: new Date(startDate) };
// //     if (endDate) {
// //       where.rebaleDate = where.rebaleDate || {};
// //       where.rebaleDate[Op.lte] = new Date(endDate);
// //     }

// //     const rebales = await db.Rebale.findAll({ where });

// //     const stats = {
// //       totalRebales: rebales.length,
// //       totalMass: rebales.reduce((sum, r) => sum + (r.totalMass || 0), 0),
// //       totalAmount: rebales.reduce((sum, r) => sum + (r.totalAmount || 0), 0),
// //     };

// //     res.json({
// //       success: true,
// //       data: stats,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to fetch rebale statistics',
// //       error: error.message,
// //     });
// //   }
// // };
// import { db } from '.././models/index.js';
// import { Op } from 'sequelize';
// import { v4 as uuidv4 } from 'uuid';

// // Get all rebales
// export const getAllRebales = async (req, res) => {
//   try {
//     const { startDate, endDate, status } = req.query;

//     const where = {};
//     if (startDate) where.rebaleDate = { [Op.gte]: new Date(startDate) };
//     if (endDate) {
//       where.rebaleDate = where.rebaleDate || {};
//       where.rebaleDate[Op.lte] = new Date(endDate);
//     }
//     if (status) where.status = status;

//     const rebales = await db.Rebale.findAll({
//       where,
//       include: [
//         {
//           model: db.Warehouse,
//           attributes: ['id', 'name', 'code'],
//         },
//         {
//           model: db.User,
//           attributes: ['id', 'firstName', 'lastName', 'username'],
//         },
//         {
//           model: db.Crop,
//           attributes: ['id', 'name', 'code'],
//         },
//         {
//           model: db.Grade,
//           attributes: ['id', 'name', 'code'],
//         },
//         {
//           model: db.Bale,
//           through: { attributes: [] },
//           attributes: ['id', 'baleTag', 'mass'],
//         },
//       ],
//       order: [['rebaleDate', 'DESC']],
//     });

//     res.json({
//       success: true,
//       data: rebales,
//       total: rebales.length,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch rebales',
//       error: error.message,
//     });
//   }
// };

// // Get rebale by ID
// export const getRebaleById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const rebale = await db.Rebale.findByPk(id, {
//       include: [
//         {
//           model: db.Warehouse,
//           attributes: ['id', 'name', 'code', 'locationId'],
//         },
//         {
//           model: db.User,
//           attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
//         },
//         {
//           model: db.Crop,
//           attributes: ['id', 'name', 'code', 'description'],
//         },
//         {
//           model: db.Grade,
//           attributes: ['id', 'name', 'code', 'description'],
//         },
//         {
//           model: db.Transport,
//           attributes: ['id', 'receiptNumber', 'status', 'createdAt'],
//         },
//         {
//           model: db.Bale,
//           through: { attributes: [] },
//           attributes: ['id', 'baleTag', 'mass', 'status'],
//         },
//       ],
//     });

//     if (!rebale) {
//       return res.status(404).json({
//         success: false,
//         message: 'Rebale not found',
//       });
//     }

//     res.json({
//       success: true,
//       data: rebale,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch rebale',
//       error: error.message,
//     });
//   }
// };

// // Create rebale with RebaleBale associations
// export const createRebale = async (req, res) => {
//   try {
//     const { cropId, gradeId, totalMass, price, warehouseId, sourceBaleIds } = req.body;

//     if (!cropId || !gradeId || !totalMass || !price) {
//       return res.status(400).json({
//         success: false,
//         message: 'Crop ID, grade ID, total mass, and price are required',
//       });
//     }

//     // Verify crop exists
//     const crop = await db.Crop.findByPk(cropId);
//     if (!crop) {
//       return res.status(404).json({
//         success: false,
//         message: 'Crop not found',
//       });
//     }

//     // Verify grade exists
//     const grade = await db.Grade.findByPk(gradeId);
//     if (!grade) {
//       return res.status(404).json({
//         success: false,
//         message: 'Grade not found',
//       });
//     }

//     // Verify warehouse exists if provided
//     if (warehouseId) {
//       const warehouse = await db.Warehouse.findByPk(warehouseId);
//       if (!warehouse) {
//         return res.status(404).json({
//           success: false,
//           message: 'Warehouse not found',
//         });
//       }
//     }

//     const buyerId = req.user.id;
//     const totalAmount = totalMass * price;
//     const rebaleTag = `RB-${Date.now()}`;

//     // Create the rebale
//     const newRebale = await db.Rebale.create({
//       rebaleTag,
//       cropId,
//       gradeId,
//       totalMass,
//       price,
//       totalAmount,
//       warehouseId: warehouseId || req.user.warehouseId || null,
//       buyerId,
//       rebaleDate: new Date(),
//       status: 'stored',
//     });

//     // Create RebaleBale associations if source bales provided
//     if (sourceBaleIds && sourceBaleIds.length > 0) {
//       const rebaleBaleEntries = sourceBaleIds.map(baleId => ({
//         rebaleId: newRebale.id,
//         baleId: baleId,
//       }));
      
//       await db.RebaleBale.bulkCreate(rebaleBaleEntries);
      
//       // Update source bales status to 'rebaled'
//       await db.Bale.update(
//         { status: 'rebaled' },
//         { where: { id: sourceBaleIds } }
//       );
//     }

//     // Fetch the created rebale with associations
//     const createdRebale = await db.Rebale.findByPk(newRebale.id, {
//       include: [
//         {
//           model: db.Bale,
//           through: { attributes: [] },
//           attributes: ['id', 'baleTag', 'mass'],
//         },
//       ],
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Rebale created successfully',
//       data: createdRebale,
//     });
//   } catch (error) {
//     console.error('Create rebale error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create rebale',
//       error: error.message,
//     });
//   }
// };

// // Create batch rebales with RebaleBale associations
// export const createBatchRebales = async (req, res) => {
//   try {
//     const { rebales } = req.body;

//     if (!rebales || rebales.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Rebales array is required',
//       });
//     }

//     const buyerId = req.user.id;
//     const receiptNumber = `RB-${Date.now()}`;
//     const createdRebales = [];

//     for (let i = 0; i < rebales.length; i++) {
//       const rebaleData = rebales[i];
      
//       // Verify crop and grade exist
//       const crop = await db.Crop.findByPk(rebaleData.cropId);
//       if (!crop) continue;

//       const grade = await db.Grade.findByPk(rebaleData.gradeId);
//       if (!grade) continue;

//       const totalAmount = rebaleData.totalMass * rebaleData.price;
//       const rebaleTag = `${receiptNumber}-${i + 1}`;

//       // Create the rebale
//       const created = await db.Rebale.create({
//         rebaleTag,
//         cropId: rebaleData.cropId,
//         gradeId: rebaleData.gradeId,
//         totalMass: rebaleData.totalMass,
//         price: rebaleData.price,
//         totalAmount,
//         buyerId,
//         warehouseId: rebaleData.warehouseId || req.user.warehouseId || null,
//         rebaleDate: new Date(),
//         status: 'stored',
//       });

//       // Create RebaleBale associations if source bales provided
//       if (rebaleData.sourceBaleIds && rebaleData.sourceBaleIds.length > 0) {
//         const rebaleBaleEntries = rebaleData.sourceBaleIds.map(baleId => ({
//           rebaleId: created.id,
//           baleId: baleId,
//         }));
        
//         await db.RebaleBale.bulkCreate(rebaleBaleEntries);
        
//         // Update source bales status to 'rebaled'
//         await db.Bale.update(
//           { status: 'rebaled' },
//           { where: { id: rebaleData.sourceBaleIds } }
//         );
//       }

//       createdRebales.push(created);
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Batch rebales created successfully',
//       data: {
//         receiptNumber,
//         rebales: createdRebales,
//       },
//     });
//   } catch (error) {
//     console.error('Batch create error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create batch rebales',
//       error: error.message,
//     });
//   }
// };

// // Update rebale status
// export const updateRebaleStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!status) {
//       return res.status(400).json({
//         success: false,
//         message: 'Status is required',
//       });
//     }

//     const rebale = await db.Rebale.findByPk(id);

//     if (!rebale) {
//       return res.status(404).json({
//         success: false,
//         message: 'Rebale not found',
//       });
//     }

//     await rebale.update({ status });

//     res.json({
//       success: true,
//       message: 'Rebale status updated successfully',
//       data: rebale,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update rebale status',
//       error: error.message,
//     });
//   }
// };

// // Update rebale
// export const updateRebale = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const rebale = await db.Rebale.findByPk(id);

//     if (!rebale) {
//       return res.status(404).json({
//         success: false,
//         message: 'Rebale not found',
//       });
//     }

//     await rebale.update(updates);

//     res.json({
//       success: true,
//       message: 'Rebale updated successfully',
//       data: rebale,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update rebale',
//       error: error.message,
//     });
//   }
// };

// // Delete rebale (also cleanup RebaleBale associations)
// export const deleteRebale = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const rebale = await db.Rebale.findByPk(id);

//     if (!rebale) {
//       return res.status(404).json({
//         success: false,
//         message: 'Rebale not found',
//       });
//     }

//     // Delete associated RebaleBale entries first
//     await db.RebaleBale.destroy({ where: { rebaleId: id } });
    
//     // Delete the rebale
//     await rebale.destroy();

//     res.json({
//       success: true,
//       message: 'Rebale deleted successfully',
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete rebale',
//       error: error.message,
//     });
//   }
// };

// // Get rebale statistics
// export const getRebaleStats = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;

//     const where = {};
//     if (startDate) where.rebaleDate = { [Op.gte]: new Date(startDate) };
//     if (endDate) {
//       where.rebaleDate = where.rebaleDate || {};
//       where.rebaleDate[Op.lte] = new Date(endDate);
//     }

//     const rebales = await db.Rebale.findAll({ where });

//     const stats = {
//       totalRebales: rebales.length,
//       totalMass: rebales.reduce((sum, r) => sum + (r.totalMass || 0), 0),
//       totalAmount: rebales.reduce((sum, r) => sum + (r.totalAmount || 0), 0),
//     };

//     res.json({
//       success: true,
//       data: stats,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch rebale statistics',
//       error: error.message,
//     });
//   }
// };
import { db } from '.././models/index.js';
import { Op } from 'sequelize';

// Get all rebales
export const getAllRebales = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    const where = {};
    if (startDate) where.rebaleDate = { [Op.gte]: new Date(startDate) };
    if (endDate) {
      where.rebaleDate = where.rebaleDate || {};
      where.rebaleDate[Op.lte] = new Date(endDate);
    }
    if (status) where.status = status;

    const rebales = await db.Rebale.findAll({
      where,
      include: [
        {
          model: db.Warehouse,
          attributes: ['id', 'name', 'code'],
        },
        {
          model: db.User,
          as: 'buyer',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: db.Crop,
          attributes: ['id', 'name', 'code'],
        },
        {
          model: db.Grade,
          attributes: ['id', 'name', 'code'],
        },
        {
          model: db.Bale,
          through: { attributes: [] },
          attributes: ['id', 'baleTag', 'mass'],
        },
      ],
      order: [['rebaleDate', 'DESC']],
    });

    res.json({
      success: true,
      data: rebales,
      total: rebales.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rebales',
      error: error.message,
    });
  }
};

// Get rebale by ID
export const getRebaleById = async (req, res) => {
  try {
    const { id } = req.params;

    const rebale = await db.Rebale.findByPk(id, {
      include: [
        {
          model: db.Warehouse,
          attributes: ['id', 'name', 'code', 'locationId'],
        },
        {
          model: db.User,
          attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
        },
        {
          model: db.Crop,
          attributes: ['id', 'name', 'code', 'description'],
        },
        {
          model: db.Grade,
          attributes: ['id', 'name', 'code', 'description'],
        },
        {
          model: db.Transport,
          attributes: ['id', 'receiptNumber', 'status', 'createdAt'],
        },
        {
          model: db.Bale,
          through: { attributes: [] },
          attributes: ['id', 'baleTag', 'mass', 'status'],
        },
      ],
    });

    if (!rebale) {
      return res.status(404).json({
        success: false,
        message: 'Rebale not found',
      });
    }

    res.json({
      success: true,
      data: rebale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rebale',
      error: error.message,
    });
  }
};

// Create single rebale
export const createRebale = async (req, res) => {
  try {
    const { cropId, gradeId, totalMass, price, warehouseId, sourceBaleIds } = req.body;

    if (!cropId || !gradeId || !totalMass || !price) {
      return res.status(400).json({
        success: false,
        message: 'Crop ID, grade ID, total mass, and price are required',
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

    const buyerId = req.user.id;
    const totalAmount = totalMass * price;
    const rebaleTag = `RB-${Date.now()}`;

    // Create the rebale
    const newRebale = await db.Rebale.create({
      rebaleTag,
      cropId,
      gradeId,
      totalMass,
      price,
      totalAmount,
      warehouseId: warehouseId || req.user.warehouseId || null,
      buyerId,
      rebaleDate: new Date(),
      status: 'stored',
    });

    // Create RebaleBale associations if source bales provided
    if (sourceBaleIds && sourceBaleIds.length > 0) {
      const rebaleBaleEntries = sourceBaleIds.map(baleId => ({
        rebaleId: newRebale.id,
        baleId: parseInt(baleId),
      }));
      
      await db.RebaleBale.bulkCreate(rebaleBaleEntries);
      
      // Update source bales status to 'rebaled'
      await db.Bale.update(
        { status: 'rebaled' },
        { where: { id: sourceBaleIds } }
      );
    }

    // Fetch the created rebale with associations
    const createdRebale = await db.Rebale.findByPk(newRebale.id, {
      include: [
        {
          model: db.Bale,
          through: { attributes: [] },
          attributes: ['id', 'baleTag', 'mass'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Rebale created successfully',
      data: createdRebale,
    });
  } catch (error) {
    console.error('Create rebale error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create rebale',
      error: error.message,
    });
  }
};

// Create batch rebales
export const createBatchRebales = async (req, res) => {
  try {
    const { rebales } = req.body;

    if (!rebales || rebales.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Rebales array is required',
      });
    }

    const buyerId = req.user.id;
    const receiptNumber = `RB-${Date.now()}`;
    const createdRebales = [];

    for (let i = 0; i < rebales.length; i++) {
      const rebaleData = rebales[i];
      
      // Verify crop and grade exist
      const crop = await db.Crop.findByPk(rebaleData.cropId);
      if (!crop) continue;

      const grade = await db.Grade.findByPk(rebaleData.gradeId);
      if (!grade) continue;

      const totalAmount = rebaleData.totalMass * rebaleData.price;
      // const rebaleTag = `${receiptNumber}-${i + 1}`;
      const rebaleTag = rebaleData.rebaleTag;

      // Create the rebale
      const created = await db.Rebale.create({
        rebaleTag,
        receiptNumber,
        cropId: rebaleData.cropId,
        gradeId: rebaleData.gradeId,
        totalMass: rebaleData.totalMass,
        price: rebaleData.price,
        totalAmount,
        buyerId,
        warehouseId: rebaleData.warehouseId || req.user.warehouseId || null,
        rebaleDate: new Date(),
        status: 'stored',
      });

      // Create RebaleBale associations if source bales provided
      if (rebaleData.sourceBaleIds && rebaleData.sourceBaleIds.length > 0) {
        const rebaleBaleEntries = rebaleData.sourceBaleIds.map(baleId => ({
          rebaleId: created.id,
          baleId: parseInt(baleId),
        }));
        
        await db.RebaleBale.bulkCreate(rebaleBaleEntries);
        
        // Update source bales status to 'rebaled'
        await db.Bale.update(
          { status: 'rebaled' },
          { where: { id: rebaleData.sourceBaleIds } }
        );
      }

      createdRebales.push(created);
    }

    // Fetch created rebales with their associated bales
    const rebalesWithBales = await db.Rebale.findAll({
      where: { id: createdRebales.map(r => r.id) },
      include: [
        {
          model: db.Bale,
          through: { attributes: [] },
          attributes: ['id', 'baleTag', 'mass'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Batch rebales created successfully',
      data: {
        receiptNumber,
        rebales: rebalesWithBales,
      },
    });
  } catch (error) {
    console.error('Batch create error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create batch rebales',
      error: error.message,
    });
  }
};

// Update rebale status
export const updateRebaleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const rebale = await db.Rebale.findByPk(id);

    if (!rebale) {
      return res.status(404).json({
        success: false,
        message: 'Rebale not found',
      });
    }

    await rebale.update({ status });

    res.json({
      success: true,
      message: 'Rebale status updated successfully',
      data: rebale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update rebale status',
      error: error.message,
    });
  }
};

// Update rebale
export const updateRebale = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const rebale = await db.Rebale.findByPk(id);

    if (!rebale) {
      return res.status(404).json({
        success: false,
        message: 'Rebale not found',
      });
    }

    // Don't allow updating sourceBaleIds through this endpoint
    delete updates.sourceBaleIds;
    
    await rebale.update(updates);

    res.json({
      success: true,
      message: 'Rebale updated successfully',
      data: rebale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update rebale',
      error: error.message,
    });
  }
};

// Delete rebale (also cleanup RebaleBale associations)
export const deleteRebale = async (req, res) => {
  try {
    const { id } = req.params;

    const rebale = await db.Rebale.findByPk(id);

    if (!rebale) {
      return res.status(404).json({
        success: false,
        message: 'Rebale not found',
      });
    }

    // Delete associated RebaleBale entries first
    await db.RebaleBale.destroy({ where: { rebaleId: id } });
    
    // Delete the rebale
    await rebale.destroy();

    res.json({
      success: true,
      message: 'Rebale deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete rebale',
      error: error.message,
    });
  }
};

// Get rebale statistics
export const getRebaleStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate) where.rebaleDate = { [Op.gte]: new Date(startDate) };
    if (endDate) {
      where.rebaleDate = where.rebaleDate || {};
      where.rebaleDate[Op.lte] = new Date(endDate);
    }

    const rebales = await db.Rebale.findAll({ where });

    const stats = {
      totalRebales: rebales.length,
      totalMass: rebales.reduce((sum, r) => sum + parseFloat(r.totalMass || 0), 0),
      totalAmount: rebales.reduce((sum, r) => sum + parseFloat(r.totalAmount || 0), 0),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rebale statistics',
      error: error.message,
    });
  }
};