// // import { db } from '.././models/index.js';

// // // Helper function to get all child location IDs recursively
// // const getAllChildLocationIds = async (locationId, allIds = []) => {
// //   allIds.push(locationId);
// //   const children = await db.Location.findAll({
// //     where: { parentId: locationId },
// //     attributes: ['id'],
// //   });
  
// //   for (const child of children) {
// //     await getAllChildLocationIds(child.id, allIds);
// //   }
  
// //   return allIds;
// // };

// // // @desc    Download data for mobile app
// // // @route   POST /api/sync/download
// // // @access  Private
// // export const downloadData = async (req, res) => {
// //   try {
// //     const { userId, locationId } = req.body;

// //     if (!userId || !locationId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'userId and locationId are required',
// //       });
// //     }

// //     // Get all child location IDs for filtering
// //     const allLocationIds = await getAllChildLocationIds(locationId);

// //     // Fetch all data (filtered by location where applicable)
// //     const [
// //       locations,
// //       warehouses,
// //       farmers,
// //       crops,
// //       grades,
// //       crop_grade_prices,
// //       loans,
// //       farmerLoans,
// //     ] = await Promise.all([
// //       db.Location.findAll(),
// //       db.Warehouse.findAll(),
// //       db.Farmer.findAll(),
// //       db.Crop.findAll(),
// //       db.Grade.findAll(),
// //       db.CropGradePrice.findAll(),
// //       db.Loan.findAll(),
// //       db.FarmerLoan.findAll(),
// //     ]);

// //     // Filter farmers by location
// //     const filteredFarmers = farmers.filter((f) => allLocationIds.includes(f.locationId));

// //     // Filter farmer loans by farmer location
// //     const farmerIds = filteredFarmers.map((f) => f.id);
// //     const filteredFarmerLoans = farmerLoans.filter((fl) => farmerIds.includes(fl.farmerId));

// //     res.status(200).json({
// //       success: true,
// //       data: {
// //         locations,
// //         warehouses,
// //         farmers: filteredFarmers,
// //         crops,
// //         grades,
// //         crop_grade_prices,
// //         loans,
// //         farmerLoans: filteredFarmerLoans,
// //       },
// //     });
// //   } catch (error) {
// //     console.error('Download error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error downloading data',
// //       error: error.message,
// //     });
// //   }
// // };

// // // @desc    Upload data from mobile app
// // // @route   POST /api/sync/upload
// // // @access  Private
// // export const uploadData = async (req, res) => {
// //   try {
// //     const {
// //       userId,
// //       purchases = [],
// //       bales = [],
// //       rebales = [],
// //       transports = [],
// //       farmerLoans = [],
// //       loanDeductions = [],
// //     } = req.body;

// //     if (!userId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'userId is required',
// //       });
// //     }

// //     const summary = {
// //       purchases: 0,
// //       bales: 0,
// //       rebales: 0,
// //       transports: 0,
// //       farmerLoans: 0,
// //       loanDeductions: 0,
// //       total: 0,
// //     };

// //     const errors = [];

// //     // Validate and insert purchases
// //     if (purchases.length > 0) {
// //       try {
// //         await db.Purchase.bulkCreate(purchases);
// //         summary.purchases = purchases.length;
// //       } catch (error) {
// //         errors.push({ entity: 'purchases', error: error.message });
// //       }
// //     }

// //     // Validate and insert bales
// //     if (bales.length > 0) {
// //       try {
// //         await db.Bale.bulkCreate(bales);
// //         summary.bales = bales.length;
// //       } catch (error) {
// //         errors.push({ entity: 'bales', error: error.message });
// //       }
// //     }

// //     // Validate and insert rebales
// //     if (rebales.length > 0) {
// //       try {
// //         await db.Rebale.bulkCreate(rebales);
// //         summary.rebales = rebales.length;
// //       } catch (error) {
// //         errors.push({ entity: 'rebales', error: error.message });
// //       }
// //     }

// //     // Validate and insert transports
// //     if (transports.length > 0) {
// //       try {
// //         await db.Transport.bulkCreate(transports);
// //         summary.transports = transports.length;
// //       } catch (error) {
// //         errors.push({ entity: 'transports', error: error.message });
// //       }
// //     }

// //     // Validate and insert farmer loans
// //     if (farmerLoans.length > 0) {
// //       try {
// //         await db.FarmerLoan.bulkCreate(farmerLoans);
// //         summary.farmerLoans = farmerLoans.length;

// //         // Update farmer debts
// //         for (const loan of farmerLoans) {
// //           const farmer = await db.Farmer.findByPk(loan.farmerId);
// //           if (farmer) {
// //             farmer.totalDebt = (farmer.totalDebt || 0) + loan.totalAmount;
// //             await farmer.save();
// //           }
// //         }
// //       } catch (error) {
// //         errors.push({ entity: 'farmerLoans', error: error.message });
// //       }
// //     }

// //     // Insert loan deductions
// //     if (loanDeductions.length > 0) {
// //       try {
// //         await db.LoanDeduction.bulkCreate(loanDeductions);
// //         summary.loanDeductions = loanDeductions.length;
// //       } catch (error) {
// //         errors.push({ entity: 'loanDeductions', error: error.message });
// //       }
// //     }

// //     summary.total =
// //       summary.purchases +
// //       summary.bales +
// //       summary.rebales +
// //       summary.transports +
// //       summary.farmerLoans +
// //       summary.loanDeductions;

// //     if (errors.length > 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Some data failed to sync',
// //         summary,
// //         errors,
// //       });
// //     }

// //     res.status(200).json({
// //       success: true,
// //       message: 'Data synced successfully',
// //       summary,
// //     });
// //   } catch (error) {
// //     console.error('Upload error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error uploading data',
// //       error: error.message,
// //     });
// //   }
// // };

// // export default {
// //   downloadData,
// //   uploadData,
// // };


// // backend/controllers/syncController.js
// import { db } from '.././models/index.js';
// import { Op } from 'sequelize';

// // Helper function to get all child location IDs recursively
// const getAllChildLocationIds = async (locationId, allIds = []) => {
//   allIds.push(Number(locationId));
//   const children = await db.Location.findAll({
//     where: { parentId: locationId },
//     attributes: ['id'],
//   });
  
//   for (const child of children) {
//     await getAllChildLocationIds(child.id, allIds);
//   }
  
//   return allIds;
// };

// // Helper function to extract local ID from global ID (DEV001-123 -> 123)
// const extractLocalId = (globalId) => {
//   if (!globalId) return null;
//   const parts = String(globalId).split('-');
//   return parts.length > 1 ? parseInt(parts[1]) : parseInt(globalId);
// };

// // Helper function to extract device ID from global ID (DEV001-123 -> DEV001)
// const extractDeviceId = (globalId) => {
//   if (!globalId) return null;
//   const parts = String(globalId).split('-');
//   return parts.length > 1 ? parts[0] : null;
// };

// // @desc    Download data for mobile app
// // @route   POST /api/sync/download
// // @access  Private
// export const downloadData = async (req, res) => {
//   try {
//     const { userId, locationId } = req.body;

//     if (!userId || !locationId) {
//       return res.status(400).json({
//         success: false,
//         message: 'userId and locationId are required',
//       });
//     }

//     // Get user to verify they exist
//     const user = await db.User.findByPk(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found',
//       });
//     }

//     // Get all child location IDs for filtering
//     const allLocationIds = await getAllChildLocationIds(locationId);

//     // Fetch all reference data
//     const [
//       locations,
//       warehouses,
//       crops,
//       grades,
//       cropGradePrices,
//       loans,
//       roles,
//       users,
//     ] = await Promise.all([
//       db.Location.findAll({
//         order: [['name', 'ASC']],
//       }),
//       db.Warehouse.findAll({
//         where: { locationId: { [Op.in]: allLocationIds } },
//         order: [['name', 'ASC']],
//       }),
//       db.Crop.findAll({
//         order: [['name', 'ASC']],
//       }),
//       db.Grade.findAll({
//         order: [['name', 'ASC']],
//       }),
//       db.CropGradePrice.findAll({
//         order: [['effectiveDate', 'DESC']],
//       }),
//       db.Loan.findAll({
//         order: [['name', 'ASC']],
//       }),
//       db.Role.findAll({
//         where: { isActive: true },
//         order: [['name', 'ASC']],
//       }),
//       db.User.findAll({
//         attributes: { exclude: ['password'] },
//         where: { locationId: { [Op.in]: allLocationIds }, isActive: true },
//         order: [['firstName', 'ASC']],
//       }),
//     ]);

//     // Fetch farmers - filtered by location hierarchy
//     const farmers = await db.Farmer.findAll({
//       where: { locationId: { [Op.in]: allLocationIds } },
//       include: [
//         {
//           model: db.Location,
//           as: 'Location',
//           attributes: ['id', 'name', 'code', 'type'],
//         },
//       ],
//       order: [['createdAt', 'DESC']],
//     });

//     // Fetch farmer loans - only for farmers in the filtered list
//     const farmerIds = farmers.map((f) => f.id);
//     const farmerLoans = await db.FarmerLoan.findAll({
//       where: { farmerId: { [Op.in]: farmerIds } },
//       include: [
//         {
//           model: db.Loan,
//           attributes: ['id', 'name', 'type', 'price', 'unit'],
//         },
//       ],
//       order: [['issuedDate', 'DESC']],
//     });

//     // Fetch settings
//     const settings = await db.Setting.findOne({
//       order: [['updatedAt', 'DESC']],
//     });

//     res.status(200).json({
//       success: true,
//       data: {
//         locations,
//         warehouses,
//         farmers,
//         crops,
//         grades,
//         crop_grade_prices: cropGradePrices,
//         loans,
//         farmerLoans,
//         roles,
//         users,
//         settings: settings || { deductionPercentage: 30 },
//       },
//       meta: {
//         locationCount: allLocationIds.length,
//         farmerCount: farmers.length,
//         timestamp: new Date().toISOString(),
//       },
//     });
//   } catch (error) {
//     console.error('Download error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error downloading data',
//       error: error.message,
//     });
//   }
// };

// // @desc    Upload data from mobile app
// // @route   POST /api/sync/upload
// // @access  Private
// export const uploadData = async (req, res) => {
//   const transaction = await db.sequelize.transaction();
  
//   try {
//     const {
//       userId,
//       purchases = [],
//       bales = [],
//       rebales = [],
//       rebaleBales = [],
//       transports = [],
//       transportRebales = [],
//       farmerLoans = [],
//       loanDeductions = [],
//     } = req.body;

//     if (!userId) {
//       await transaction.rollback();
//       return res.status(400).json({
//         success: false,
//         message: 'userId is required',
//       });
//     }

//     // Verify user exists
//     const user = await db.User.findByPk(userId, { transaction });
//     if (!user) {
//       await transaction.rollback();
//       return res.status(404).json({
//         success: false,
//         message: 'User not found',
//       });
//     }

//     const summary = {
//       purchases: 0,
//       bales: 0,
//       rebales: 0,
//       rebaleBales: 0,
//       transports: 0,
//       transportRebales: 0,
//       farmerLoans: 0,
//       loanDeductions: 0,
//       total: 0,
//     };

//     const errors = [];
//     const processedRecords = new Map(); // Track processed records for conflict resolution
//     console.log('all payload data',req.body);

//     // ==================== PROCESS PURCHASES ====================
//     if (purchases.length > 0) {
//     console.log('IMEFIKA-PURCHASE',purchases);
//       for (const purchase of purchases) {
//         try {
//           const existingPurchase = await db.Purchase.findByPk(purchase.id, { transaction });
          
//           if (existingPurchase) {
//             // Conflict resolution: newest wins based on updatedAt
//             const mobileUpdated = new Date(purchase.updatedAt);
//             const serverUpdated = new Date(existingPurchase.updatedAt);
            
//             if (mobileUpdated > serverUpdated) {
//               await existingPurchase.update(purchase, { transaction });
//               summary.purchases++;
//             }
//           } else {
//             await db.Purchase.create(purchase, { transaction });
//             summary.purchases++;
//           }
//         } catch (error) {
//           errors.push({ entity: 'purchases', id: purchase.id, error: error.message });
//         }
//       }
//     }

//     // ==================== PROCESS BALES ====================
//     if (bales.length > 0) {
//       console.log('IMEFIKA-BALES',bales);
//       console.log(`📦 Processing ${bales.length} bales...`);
      
//       for (const bale of bales) {
//         try {
//           // 🔥 Convert purchaseId if it's a global ID
//           if (bale.purchaseId && String(bale.purchaseId).includes('-')) {
//             // Extract local ID from global ID
//             const localPart = extractLocalId(bale.purchaseId);
//             // Try to find the purchase by the original device ID
//             const purchase = await db.Purchase.findOne({
//               where: { 
//                 originalDeviceId: extractDeviceId(bale.purchaseId),
//                 originalLocalId: localPart 
//               },
//               transaction
//             });
            
//             if (purchase) {
//               bale.purchaseId = purchase.id; // Use server's actual ID
//             }
//           }
          
//           const existingBale = await db.Bale.findByPk(bale.id, { transaction });
          
//           if (!existingBale) {
//             await db.Bale.create(bale, { transaction });
//             summary.bales++;
//           }
//         } catch (error) {
//           errors.push({ entity: 'bales', id: bale.id, error: error.message });
//         }
//       }
//       console.log(`✅ Bales: ${summary.bales} created`);
//     }

//     // ==================== PROCESS REBALES ====================
//     if (rebales.length > 0) {
//     console.log('IMEFIKA-rebale',rebales);
//       for (const rebale of rebales) {
//         try {
//           const existingRebale = await db.Rebale.findByPk(rebale.id, { transaction });
          
//           if (existingRebale) {
//             const mobileUpdated = new Date(rebale.updatedAt);
//             const serverUpdated = new Date(existingRebale.updatedAt);
            
//             if (mobileUpdated > serverUpdated) {
//               await existingRebale.update(rebale, { transaction });
//               summary.rebales++;
//             }
//           } else {
//             await db.Rebale.create(rebale, { transaction });
//             summary.rebales++;
//           }
//         } catch (error) {
//           errors.push({ entity: 'rebales', id: rebale.id, error: error.message });
//         }
//       }
//     }

//     // ==================== PROCESS REBALE BALES (JUNCTION) ====================
//     if (rebaleBales && rebaleBales.length > 0) {
//     console.log('IMEFIKA-rebaleBales',rebaleBales);
//       for (const rb of rebaleBales) {
//         try {
//           const existing = await db.RebaleBale.findOne({
//             where: { rebaleId: rb.rebaleId, baleId: rb.baleId },
//             transaction,
//           });
          
//           if (!existing) {
//             await db.RebaleBale.create(rb, { transaction });
//             summary.rebaleBales++;
//           }
//         } catch (error) {
//           errors.push({ entity: 'rebaleBales', error: error.message });
//         }
//       }
//     }

//     // ==================== PROCESS TRANSPORTS ====================
//     if (transports.length > 0) {
//     console.log('IMEFIKA-transports',transports);
//       for (const transport of transports) {
//         try {
//           const existingTransport = await db.Transport.findByPk(transport.id, { transaction });
          
//           if (existingTransport) {
//             const mobileUpdated = new Date(transport.updatedAt);
//             const serverUpdated = new Date(existingTransport.updatedAt);
            
//             if (mobileUpdated > serverUpdated) {
//               await existingTransport.update(transport, { transaction });
//               summary.transports++;
//             }
//           } else {
//             await db.Transport.create(transport, { transaction });
//             summary.transports++;
//           }
//         } catch (error) {
//           errors.push({ entity: 'transports', id: transport.id, error: error.message });
//         }
//       }
//     }

//     // ==================== PROCESS TRANSPORT REBALES (JUNCTION) ====================
//     if (transportRebales && transportRebales.length > 0) {
//     console.log('IMEFIKA-transportRebales',transportRebales);
//       for (const tr of transportRebales) {
//         try {
//           const existing = await db.TransportRebale.findOne({
//             where: { transportId: tr.transportId, rebaleId: tr.rebaleId },
//             transaction,
//           });
          
//           if (!existing) {
//             await db.TransportRebale.create(tr, { transaction });
//             summary.transportRebales++;
//           }
//         } catch (error) {
//           errors.push({ entity: 'transportRebales', error: error.message });
//         }
//       }
//     }

//     // ==================== PROCESS FARMER LOANS ====================
//     if (farmerLoans.length > 0) {
//     console.log('IMEFIKA-farmerLoans',farmerLoans);
//       for (const loan of farmerLoans) {
//         try {
//           // Extract local farmer ID if it's a global ID
//           let farmerId = loan.farmerId;
//           if (String(farmerId).includes('-')) {
//             farmerId = extractLocalId(farmerId);
//             loan.farmerId = farmerId;
//           }
          
//           const existingLoan = await db.FarmerLoan.findByPk(loan.id, { transaction });
          
//           if (existingLoan) {
//             const mobileUpdated = new Date(loan.updatedAt);
//             const serverUpdated = new Date(existingLoan.updatedAt);
            
//             if (mobileUpdated > serverUpdated) {
//               const oldTotalAmount = existingLoan.totalAmount;
//               await existingLoan.update(loan, { transaction });
              
//               // Update farmer debt if amount changed
//               if (loan.totalAmount !== oldTotalAmount) {
//                 const farmer = await db.Farmer.findByPk(farmerId, { transaction });
//                 if (farmer) {
//                   const debtDifference = loan.totalAmount - oldTotalAmount;
//                   farmer.totalDebt = (farmer.totalDebt || 0) + debtDifference;
//                   await farmer.save({ transaction });
//                 }
//               }
//               summary.farmerLoans++;
//             }
//           } else {
//             await db.FarmerLoan.create(loan, { transaction });
            
//             // Update farmer's total debt
//             const farmer = await db.Farmer.findByPk(farmerId, { transaction });
//             if (farmer) {
//               farmer.totalDebt = (farmer.totalDebt || 0) + loan.totalAmount;
//               await farmer.save({ transaction });
//             }
//             summary.farmerLoans++;
//           }
//         } catch (error) {
//           errors.push({ entity: 'farmerLoans', id: loan.id, error: error.message });
//         }
//       }
//     }

//     // ==================== PROCESS LOAN DEDUCTIONS ====================
//     if (loanDeductions.length > 0) {
//     console.log('IMEFIKA-loanDeductions',loanDeductions);
//       for (const deduction of loanDeductions) {
//         try {
//           // Extract local IDs if they are global IDs
//           let purchaseId = deduction.purchaseId;
//           let farmerLoanId = deduction.farmerLoanId;
          
//           if (String(purchaseId).includes('-')) {
//             purchaseId = extractLocalId(purchaseId);
//             deduction.purchaseId = purchaseId;
//           }
//           if (String(farmerLoanId).includes('-')) {
//             farmerLoanId = extractLocalId(farmerLoanId);
//             deduction.farmerLoanId = farmerLoanId;
//           }
          
//           const existing = await db.LoanDeduction.findOne({
//             where: { 
//               purchaseId: purchaseId, 
//               farmerLoanId: farmerLoanId 
//             },
//             transaction,
//           });
          
//           if (!existing) {
//             await db.LoanDeduction.create(deduction, { transaction });
            
//             // Update farmer loan remaining debt
//             const farmerLoan = await db.FarmerLoan.findByPk(farmerLoanId, { transaction });
//             if (farmerLoan) {
//               farmerLoan.remainingDebt = Math.max(0, (farmerLoan.remainingDebt || 0) - deduction.deductedAmount);
//               if (farmerLoan.remainingDebt <= 0) {
//                 farmerLoan.status = 'completed';
//               }
//               await farmerLoan.save({ transaction });
              
//               // Update farmer's total debt
//               const farmer = await db.Farmer.findByPk(farmerLoan.farmerId, { transaction });
//               if (farmer) {
//                 farmer.totalDebt = Math.max(0, (farmer.totalDebt || 0) - deduction.deductedAmount);
//                 await farmer.save({ transaction });
//               }
//             }
            
//             summary.loanDeductions++;
//           }
//         } catch (error) {
//           errors.push({ entity: 'loanDeductions', error: error.message });
//         }
//       }
//     }

//     // Calculate total
//     summary.total = Object.values(summary).reduce((a, b) => a + b, 0) - summary.total;

//     await transaction.commit();

//     // Return response with any non-critical errors
//     if (errors.length > 0) {
//     console.log('IMEFIKA-errors',errors);
//       return res.status(207).json({
//         success: true,
//         partial: true,
//         message: `Synced with ${errors.length} non-critical errors`,
//         summary,
//         errors,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'All data synced successfully',
//       summary,
//     });
    
//   } catch (error) {
//     await transaction.rollback();
//     console.error('Upload error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error uploading data',
//       error: error.message,
//     });
//   }
// };

// // @desc    Get sync status (pending records count, last sync, etc.)
// // @route   GET /api/sync/status
// // @access  Private
// export const getSyncStatus = async (req, res) => {
//   try {
//     const { userId } = req.query;
    
//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: 'userId is required',
//       });
//     }
    
//     // Get counts from various tables for mobile sync tracking
//     const [
//       totalFarmers,
//       totalPurchases,
//       totalBales,
//       totalRebales,
//       totalTransports,
//       totalFarmerLoans,
//     ] = await Promise.all([
//       db.Farmer.count(),
//       db.Purchase.count(),
//       db.Bale.count(),
//       db.Rebale.count(),
//       db.Transport.count(),
//       db.FarmerLoan.count(),
//     ]);
    
//     res.status(200).json({
//       success: true,
//       data: {
//         totalFarmers,
//         totalPurchases,
//         totalBales,
//         totalRebales,
//         totalTransports,
//         totalFarmerLoans,
//         lastSync: new Date().toISOString(),
//       },
//     });
//   } catch (error) {
//     console.error('Sync status error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error getting sync status',
//       error: error.message,
//     });
//   }
// };

// // @desc    Download only specific tables (for partial sync)
// // @route   POST /api/sync/download-partial
// // @access  Private
// export const downloadPartial = async (req, res) => {
//   try {
//     const { userId, locationId, tables = [] } = req.body;
    
//     if (!userId || !locationId) {
//       return res.status(400).json({
//         success: false,
//         message: 'userId and locationId are required',
//       });
//     }
    
//     const allLocationIds = await getAllChildLocationIds(locationId);
//     const result = {};
    
//     for (const table of tables) {
//       switch (table) {
//         case 'farmers':
//           result.farmers = await db.Farmer.findAll({
//             where: { locationId: { [Op.in]: allLocationIds } },
//           });
//           break;
//         case 'crops':
//           result.crops = await db.Crop.findAll();
//           break;
//         case 'grades':
//           result.grades = await db.Grade.findAll();
//           break;
//         case 'prices':
//           result.prices = await db.CropGradePrice.findAll();
//           break;
//         case 'loans':
//           result.loans = await db.Loan.findAll();
//           break;
//         case 'locations':
//           result.locations = await db.Location.findAll();
//           break;
//         case 'warehouses':
//           result.warehouses = await db.Warehouse.findAll({
//             where: { locationId: { [Op.in]: allLocationIds } },
//           });
//           break;
//         default:
//           break;
//       }
//     }
    
//     res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     console.error('Partial download error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error downloading partial data',
//       error: error.message,
//     });
//   }
// };

// export default {
//   downloadData,
//   uploadData,
//   getSyncStatus,
//   downloadPartial,
// };

// backend/controllers/syncController.js
// Add these improvements for production

import { db } from '.././models/index.js';
import { Op } from 'sequelize';
import farmer from '../models/farmer.js';

// 🔥 IMPROVEMENT 1: Add retry logic for deadlocks
const withRetry = async (fn, maxRetries = 3) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (error.name === 'SequelizeDeadlockError' && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

// 🔥 IMPROVEMENT 2: Validate IDs before processing
// const isValidId = (id) => {
//   if (!id) return false;
//   const str = String(id);
//   // Allow both "123" and "DEV001-123" formats
//   return /^([A-Z0-9]+-)?\d+$/.test(str);
// };
const isValidId = (id) => {
  if (!id) return false;
  const str = String(id);
  return /^([A-Z0-9]+-)*\d+$/.test(str);
};

// 🔥 IMPROVEMENT 3: Sanitize data before insert
const sanitizeRecord = (record, tableName) => {
  const sanitized = { ...record };
  
  // Remove any fields that shouldn't be inserted
  delete sanitized.createdAt;
  delete sanitized.updatedAt;
  
  // Ensure required fields exist based on table
  return sanitized;
};

// 🔥 IMPROVEMENT 4: Add rate limiting for large uploads
const BATCH_SIZE = 100;

// 🔥 IMPROVEMENT 5: Add more detailed summary
const createDetailedSummary = (summary, errors, startTime) => {
  return {
    ...summary,
    errors: errors.length,
    duration: Date.now() - startTime,
    timestamp: new Date().toISOString(),
  };
};

// Helper function to get all child location IDs recursively
const getAllChildLocationIds = async (locationId, allIds = []) => {
  allIds.push(Number(locationId));
  const children = await db.Location.findAll({
    where: { parentId: locationId },
    attributes: ['id'],
  });
  
  for (const child of children) {
    await getAllChildLocationIds(child.id, allIds);
  }
  
  return allIds;
};

// Helper function to extract local ID from global ID (DEV001-123 -> 123)
const extractLocalId = (globalId) => {
  if (!globalId) return null;
  const parts = String(globalId).split('-');
  return parts.length > 1 ? parseInt(parts[1]) : parseInt(globalId);
};

// Helper function to extract device ID from global ID (DEV001-123 -> DEV001)
const extractDeviceId = (globalId) => {
  if (!globalId) return null;
  const parts = String(globalId).split('-');
  return parts.length > 1 ? parts[0] : null;
};

// @desc    Download data for mobile app
// @route   POST /api/sync/download
// @access  Private
export const downloadData = async (req, res) => {
  try {
    const { userId, locationId } = req.body;

    if (!userId || !locationId) {
      return res.status(400).json({
        success: false,
        message: 'userId and locationId are required',
      });
    }

    // Get user to verify they exist
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get all child location IDs for filtering
    const allLocationIds = await getAllChildLocationIds(locationId);

    // Fetch all reference data
    const [
      locations,
      warehouses,
      crops,
      grades,
      cropGradePrices,
      loans,
      roles,
      users,
    ] = await Promise.all([
      db.Location.findAll({
        order: [['name', 'ASC']],
      }),
      db.Warehouse.findAll({
        where: { locationId: { [Op.in]: allLocationIds } },
        order: [['name', 'ASC']],
      }),
      db.Crop.findAll({
        order: [['name', 'ASC']],
      }),
      db.Grade.findAll({
        order: [['name', 'ASC']],
      }),
      db.CropGradePrice.findAll({
        order: [['effectiveDate', 'DESC']],
      }),
      db.Loan.findAll({
        order: [['name', 'ASC']],
      }),
      db.Role.findAll({
        where: { isActive: true },
        order: [['name', 'ASC']],
      }),
      db.User.findAll({
        attributes: { exclude: ['password'] },
        where: { locationId: { [Op.in]: allLocationIds }, isActive: true },
        order: [['firstName', 'ASC']],
      }),
    ]);

    // Fetch farmers - filtered by location hierarchy
    const farmers = await db.Farmer.findAll({
      where: { locationId: { [Op.in]: allLocationIds } },
      include: [
        {
          model: db.Location,
          as: 'Location',
          attributes: ['id', 'name', 'code', 'type'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Fetch farmer loans - only for farmers in the filtered list
    const farmerIds = farmers.map((f) => f.id);
    const farmerLoans = await db.FarmerLoan.findAll({
      where: { farmerId: { [Op.in]: farmerIds } },
      include: [
        {
          model: db.Loan,
          attributes: ['id', 'name', 'type', 'price', 'unit'],
        },
      ],
      order: [['issuedDate', 'DESC']],
    });

    // Fetch settings
    const settings = await db.Setting.findOne({
      order: [['updatedAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: {
        locations,
        warehouses,
        farmers,
        crops,
        grades,
        crop_grade_prices: cropGradePrices,
        loans,
        farmerLoans,
        roles,
        users,
        settings: settings || { deductionPercentage: 30 },
      },
      meta: {
        locationCount: allLocationIds.length,
        farmerCount: farmers.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading data',
      error: error.message,
    });
  }
};

// @desc    Upload data from mobile app
// @route   POST /api/sync/upload
// @access  Private
// @desc    Upload data from mobile app (IMPROVED VERSION)
export const uploadData = async (req, res) => {
  const startTime = Date.now();
  const transaction = await db.sequelize.transaction();
  
  try {
    const {
      userId,
      purchases = [],
      bales = [],
      rebales = [],
      rebaleBales = [],
      transports = [],
      transportRebales = [],
      farmerLoans = [],
      loanDeductions = [],
    } = req.body;

    if (!userId) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'userId is required',
      });
    }

    // Verify user exists
    const user = await db.User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const summary = {
      purchases: 0,
      bales: 0,
      rebales: 0,
      rebaleBales: 0,
      transports: 0,
      transportRebales: 0,
      farmerLoans: 0,
      loanDeductions: 0,
      total: 0,
      skipped: 0,
    };

    const errors = [];

    console.log('all payload data:', req.body);
    // ==================== PROCESS PURCHASES ====================
    console.log('IMEFIKA-purchase: ',purchases);
    if (purchases.length > 0) {
      console.log(`📦 Processing ${purchases.length} purchases...`);
      
      // 🔥 Process in batches to avoid memory issues
      for (let i = 0; i < purchases.length; i += BATCH_SIZE) {
        const batch = purchases.slice(i, i + BATCH_SIZE);
        
        for (const purchase of batch) {
          try {
            // Validate ID format
            if (!isValidId(purchase.id)) {
              errors.push({ entity: 'purchases', id: purchase.id, error: 'Invalid ID format' });
              continue;
            }
            
            const existingPurchase = await db.Purchase.findByPk(purchase.id, { transaction });
            
            if (existingPurchase) {
              const mobileUpdated = new Date(purchase.updatedAt);
              const serverUpdated = new Date(existingPurchase.updatedAt);
              
              if (mobileUpdated > serverUpdated) {
                const sanitized = sanitizeRecord(purchase, 'purchases');
                await existingPurchase.update(sanitized, { transaction });
                summary.purchases++;
              } else {
                summary.skipped++;
              }
            } else {
              const sanitized = sanitizeRecord(purchase, 'purchases');
              await db.Purchase.create(sanitized, { transaction });
              summary.purchases++;
            }
          } catch (error) {
            console.error(`Purchase ${purchase.id} error:`, error.message);
            errors.push({ entity: 'purchases', id: purchase.id, error: error.message });
          }
        }
      }
      console.log(`✅ Purchases: ${summary.purchases} created/updated, ${summary.skipped} skipped`);
    }

    // ==================== PROCESS BALES ====================
    console.log('IMEFIKA-bales: ',bales);
    if (bales.length > 0) {
      console.log(`📦 Processing ${bales.length} bales...`);
      
      for (const bale of bales) {
        try {
          if (!isValidId(bale.id)) {
            errors.push({ entity: 'bales', id: bale.id, error: 'Invalid ID format' });
            continue;
          }
          
          const existingBale = await db.Bale.findByPk(bale.id, { transaction });
          
          if (existingBale) {
            const mobileUpdated = new Date(bale.updatedAt);
            const serverUpdated = new Date(existingBale.updatedAt);
            
            if (mobileUpdated > serverUpdated) {
              await existingBale.update(sanitizeRecord(bale, 'bales'), { transaction });
              summary.bales++;
            } else {
              summary.skipped++;
            }
          } else {
            await db.Bale.create(sanitizeRecord(bale, 'bales'), { transaction });
            summary.bales++;
          }
        } catch (error) {
          errors.push({ entity: 'bales', id: bale.id, error: error.message });
        }
      }
      console.log(`✅ Bales: ${summary.bales} created/updated`);
    }

    // ==================== PROCESS REBALES ====================
    console.log('IMEFIKA-rebales: ',rebales);
    if (rebales.length > 0) {
      console.log(`📦 Processing ${rebales.length} rebales...`);
      
      for (const rebale of rebales) {
        try {
          if (!isValidId(rebale.id)) {
            console.log('imekataa rebale:',rebale.id);
            errors.push({ entity: 'rebales', id: rebale.id, error: 'Invalid ID format' });
            continue;
          }
          
          const existingRebale = await db.Rebale.findByPk(rebale.id, { transaction });
          
          if (existingRebale) {
            const mobileUpdated = new Date(rebale.updatedAt);
            const serverUpdated = new Date(existingRebale.updatedAt);
            
            if (mobileUpdated > serverUpdated) {
              await existingRebale.update(sanitizeRecord(rebale, 'rebales'), { transaction });
              summary.rebales++;
            } else {
              summary.skipped++;
            }
          } else {
            console.log('Imefika kutengeneza:', rebale.id);
            await db.Rebale.create(sanitizeRecord(rebale, 'rebales'), { transaction });
            summary.rebales++;
          }
        } catch (error) {
            console.log('error rebale:',rebale.id,' :ERROR: ',error);
          errors.push({ entity: 'rebales', id: rebale.id, error: error.message });
        }
      }
      console.log(`✅ Rebales: ${summary.rebales} created/updated`);
    }

    // ==================== PROCESS REBALE BALES (JUNCTION) ====================
    console.log('IMEFIKA-rebaleBales: ',rebaleBales);
    if (rebaleBales && rebaleBales.length > 0) {
      console.log(`📦 Processing ${rebaleBales.length} rebale-bale associations...`);
      
      for (const rb of rebaleBales) {
        try {
          const existing = await db.RebaleBale.findOne({
            where: { rebaleId: rb.rebaleId, baleId: rb.baleId },
            transaction,
          });
          
          if (!existing) {
            await db.RebaleBale.create(rb, { transaction });
            summary.rebaleBales++;
          } else {
            summary.skipped++;
          }
        } catch (error) {
          errors.push({ entity: 'rebaleBales', error: error.message });
        }
      }
      console.log(`✅ RebaleBales: ${summary.rebaleBales} created`);
    }

    // ==================== PROCESS TRANSPORTS ====================
    console.log('IMEFIKA-transports: ',transports);
    if (transports.length > 0) {
      console.log(`📦 Processing ${transports.length} transports...`);
      
      for (const transport of transports) {
        try {
          if (!isValidId(transport.id)) {
            errors.push({ entity: 'transports', id: transport.id, error: 'Invalid ID format' });
            continue;
          }
          
          const existingTransport = await db.Transport.findByPk(transport.id, { transaction });
          
          if (existingTransport) {
            const mobileUpdated = new Date(transport.updatedAt);
            const serverUpdated = new Date(existingTransport.updatedAt);
            
            if (mobileUpdated > serverUpdated) {
              await existingTransport.update(sanitizeRecord(transport, 'transports'), { transaction });
              summary.transports++;
            } else {
              summary.skipped++;
            }
          } else {
            await db.Transport.create(sanitizeRecord(transport, 'transports'), { transaction });
            summary.transports++;
          }
        } catch (error) {
          errors.push({ entity: 'transports', id: transport.id, error: error.message });
        }
      }
      console.log(`✅ Transports: ${summary.transports} created/updated`);
    }

    // ==================== PROCESS TRANSPORT REBALES (JUNCTION) ====================
    console.log('IMEFIKA-transportRebales: ',transportRebales);
    if (transportRebales && transportRebales.length > 0) {
      console.log(`📦 Processing ${transportRebales.length} transport-rebale associations...`);
      
      for (const tr of transportRebales) {
        try {
          const existing = await db.TransportRebale.findOne({
            where: { transportId: tr.transportId, rebaleId: tr.rebaleId },
            transaction,
          });
          
          if (!existing) {
            await db.TransportRebale.create(tr, { transaction });
            summary.transportRebales++;
          } else {
            summary.skipped++;
          }
        } catch (error) {
          errors.push({ entity: 'transportRebales', error: error.message });
        }
      }
      console.log(`✅ TransportRebales: ${summary.transportRebales} created`);
    }

    // // ==================== PROCESS FARMER LOANS ====================
    // console.log('IMEFIKA-farmerLoans: ',farmerLoans);
    // if (farmerLoans.length > 0) {
    //   console.log(`📦 Processing ${farmerLoans.length} farmer loans...`);
      
    //   for (const loan of farmerLoans) {
    //     try {
    //       if (!isValidId(loan.id)) {
    //         errors.push({ entity: 'farmerLoans', id: loan.id, error: 'Invalid ID format' });
    //         continue;
    //       }
          
    //       let farmerId = loan.farmerId;
    //       if (String(farmerId).includes('-')) {
    //         farmerId = extractLocalId(farmerId);
    //         loan.farmerId = farmerId;
    //       }
    //       farmerId = Number(farmerId);
    //       console.log('Farmer ID: ',farmerId),' -->Datatype : ', typeof farmerId;
          
    //       const existingLoan = await db.FarmerLoan.findByPk(loan.id, { transaction });
          
    //       if (existingLoan) {
    //         const mobileUpdated = new Date(loan.updatedAt);
    //         const serverUpdated = new Date(existingLoan.updatedAt);
            
    //         if (mobileUpdated > serverUpdated) {
    //           const oldTotalAmount = existingLoan.totalAmount;
    //           await existingLoan.update(sanitizeRecord(loan, 'farmerLoans'), { transaction });
              
    //           if (loan.totalAmount !== oldTotalAmount) {
    //             const farmer = await db.Farmer.findByPk(farmerId, { transaction });
    //             if (farmer) {
    //               const debtDifference = loan.totalAmount - oldTotalAmount;
    //               farmer.totalDebt = (farmer.totalDebt || 0) + debtDifference;
    //               await farmer.save({ transaction });
    //             }
    //           }
    //           summary.farmerLoans++;
    //         } else {
    //           summary.skipped++;
    //         }
    //       } else {
    //         await db.FarmerLoan.create(sanitizeRecord(loan, 'farmerLoans'), { transaction });
            
    //         const farmer = await db.Farmer.findByPk(farmerId, { transaction });
    //         if (farmer) {
    //           farmer.totalDebt = (farmer.totalDebt || 0) + loan.totalAmount;
    //           await farmer.save({ transaction });
    //         }
    //         summary.farmerLoans++;
    //       }
    //     } catch (error) {
    //       errors.push({ entity: 'farmerLoans', id: loan.id, error: error.message });
    //     }
    //   }
    //   console.log(`✅ FarmerLoans: ${summary.farmerLoans} created/updated`);
    // }

    // // ==================== PROCESS LOAN DEDUCTIONS ====================
    // console.log('IMEFIKA-loanDeductions: ',loanDeductions);
    // if (loanDeductions.length > 0) {
    //   console.log(`📦 Processing ${loanDeductions.length} loan deductions...`);
      
    //   for (const deduction of loanDeductions) {
    //     try {
    //       let purchaseId = deduction.purchaseId;
    //       let farmerLoanId = deduction.farmerLoanId;
          
    //       if (String(purchaseId).includes('-')) {
    //         // purchaseId = extractLocalId(purchaseId);
    //         // deduction.purchaseId = purchaseId;
    //       }
    //       if (String(farmerLoanId).includes('-')) {
    //         // farmerLoanId = extractLocalId(farmerLoanId);
    //         // deduction.farmerLoanId = farmerLoanId;
    //       }
          
    //       const existing = await db.LoanDeduction.findOne({
    //         where: { purchaseId, farmerLoanId },
    //         transaction,
    //       });
          
    //       if (!existing) {
    //         await db.LoanDeduction.create(deduction, { transaction });
            
    //         const farmerLoan = await db.FarmerLoan.findByPk(farmerLoanId, { transaction });
    //         if (farmerLoan) {
    //           farmerLoan.remainingDebt = Math.max(0, (farmerLoan.remainingDebt || 0) - deduction.deductedAmount);
    //           if (farmerLoan.remainingDebt <= 0) {
    //             farmerLoan.status = 'completed';
    //           }
    //           await farmerLoan.save({ transaction });
              
    //           const farmer = await db.Farmer.findByPk(farmerLoan.farmerId, { transaction });
    //           if (farmer) {
    //             farmer.totalDebt = Math.max(0, (farmer.totalDebt || 0) - deduction.deductedAmount);
    //             await farmer.save({ transaction });
    //           }
    //         }
            
    //         summary.loanDeductions++;
    //       } else {
    //         summary.skipped++;
    //       }
    //     } catch (error) {
    //       errors.push({ entity: 'loanDeductions', error: error.message });
    //     }
    //   }
    //   console.log(`✅ LoanDeductions: ${summary.loanDeductions} created`);
    // }

    // ==================== PROCESS FARMER LOANS ====================
    console.log('IMEFIKA-farmerLoans: ',farmerLoans);
    if (farmerLoans.length > 0) {
      console.log(`📦 Processing ${farmerLoans.length} farmer loans...`);
      
      for (const loan of farmerLoans) {
        try {
          if (!isValidId(loan.id)) {
            errors.push({ entity: 'farmerLoans', id: loan.id, error: 'Invalid ID format' });
            continue;
          }
          
          let farmerId = loan.farmerId;
          if (String(farmerId).includes('-')) {
            farmerId = extractLocalId(farmerId);
            loan.farmerId = farmerId;
          }
          farmerId = Number(farmerId);
          
          const existingLoan = await db.FarmerLoan.findByPk(loan.id, { transaction });
          
          if (existingLoan) {
            const mobileUpdated = new Date(loan.updatedAt);
            const serverUpdated = new Date(existingLoan.updatedAt);
            
            if (mobileUpdated > serverUpdated) {
              await existingLoan.update(sanitizeRecord(loan, 'farmerLoans'), { transaction });
              summary.farmerLoans++;
            } else {
              summary.skipped++;
            }
          } else {
            await db.FarmerLoan.create(sanitizeRecord(loan, 'farmerLoans'), { transaction });
            summary.farmerLoans++;
          }

          // 🔥 FIX: Recalculate farmer totalDebt from ALL active loans after each change
          // This ensures server value matches the sum of remainingDebt
          const allActiveLoans = await db.FarmerLoan.findAll({
            where: { farmerId: farmerId, status: 'active' },
            attributes: ['remainingDebt'],
            transaction,
          });

          const calculatedTotalDebt = allActiveLoans.reduce(
            (sum, l) => sum + (parseFloat(l.remainingDebt) || 0), 
            0
          );

          const farmer = await db.Farmer.findByPk(farmerId, { transaction });
          if (farmer) {
            farmer.totalDebt = calculatedTotalDebt;
            await farmer.save({ transaction });
            console.log(`📊 Farmer #${farmerId} totalDebt recalculated: TZS ${calculatedTotalDebt}`);
          }

        } catch (error) {
          errors.push({ entity: 'farmerLoans', id: loan.id, error: error.message });
        }
      }
      console.log(`✅ FarmerLoans: ${summary.farmerLoans} created/updated`);
    }

    // ==================== PROCESS LOAN DEDUCTIONS ====================
    console.log('IMEFIKA-loanDeductions: ',loanDeductions);
    if (loanDeductions.length > 0) {
      console.log(`📦 Processing ${loanDeductions.length} loan deductions...`);
      
      // Track which farmers need debt recalculation
      const affectedFarmers = new Set();
      
      for (const deduction of loanDeductions) {
        try {
          let purchaseId = deduction.purchaseId;
          let farmerLoanId = deduction.farmerLoanId;
          
          // Keep global IDs as-is (they reference mobile-created records)
          // The server uses these to find the correct records
          
          const existing = await db.LoanDeduction.findOne({
            where: { purchaseId, farmerLoanId },
            transaction,
          });
          
          if (!existing) {
            await db.LoanDeduction.create(deduction, { transaction });
            
            // Update farmer loan remaining debt
            const farmerLoan = await db.FarmerLoan.findByPk(farmerLoanId, { transaction });
            if (farmerLoan) {
              farmerLoan.remainingDebt = Math.max(
                0, 
                (parseFloat(farmerLoan.remainingDebt) || 0) - parseFloat(deduction.deductedAmount)
              );
              if (farmerLoan.remainingDebt <= 0) {
                farmerLoan.status = 'completed';
              }
              await farmerLoan.save({ transaction });
              
              // Track this farmer for recalculation
              affectedFarmers.add(farmerLoan.farmerId);
            }
            
            summary.loanDeductions++;
          } else {
            summary.skipped++;
          }
        } catch (error) {
          errors.push({ entity: 'loanDeductions', error: error.message });
        }
      }

      // 🔥 FIX: Recalculate farmer totalDebt from ALL active loans (not add/subtract)
      for (const farmerId of affectedFarmers) {
        const allActiveLoans = await db.FarmerLoan.findAll({
          where: { farmerId: farmerId, status: 'active' },
          attributes: ['remainingDebt'],
          transaction,
        });

        const calculatedTotalDebt = allActiveLoans.reduce(
          (sum, l) => sum + (parseFloat(l.remainingDebt) || 0), 
          0
        );

        const farmer = await db.Farmer.findByPk(farmerId, { transaction });
        if (farmer) {
          // Also include completed loans that still have remainingDebt > 0 (edge case)
          const completedLoansWithDebt = await db.FarmerLoan.findAll({
            where: { 
              farmerId: farmerId, 
              status: 'completed',
              remainingDebt: { [Op.gt]: 0 }
            },
            attributes: ['remainingDebt'],
            transaction,
          });
          
          let finalDebt = calculatedTotalDebt;
          for (const l of completedLoansWithDebt) {
            finalDebt += parseFloat(l.remainingDebt) || 0;
          }

          farmer.totalDebt = Math.max(0, finalDebt);
          await farmer.save({ transaction });
          console.log(`📊 Farmer #${farmerId} totalDebt recalculated after deductions: TZS ${farmer.totalDebt}`);
        }
      }
      
      console.log(`✅ LoanDeductions: ${summary.loanDeductions} created, ${affectedFarmers.size} farmers updated`);
    }

    // Calculate total
    summary.total = summary.purchases + summary.bales + summary.rebales + 
                    summary.rebaleBales + summary.transports + summary.transportRebales + 
                    summary.farmerLoans + summary.loanDeductions;

    await transaction.commit();

    const detailedSummary = createDetailedSummary(summary, errors, startTime);
    console.log(`🎉 Sync completed in ${detailedSummary.duration}ms - Total: ${summary.total}, Errors: ${errors.length}`);

    if (errors.length > 0) {
      console.log('ERRORS: ',errors);
      return res.status(207).json({
        success: true,
        partial: true,
        message: `Synced with ${errors.length} non-critical errors`,
        summary: detailedSummary,
        errors,
      });
    }

    res.status(200).json({
      success: true,
      message: 'All data synced successfully',
      summary: detailedSummary,
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading data',
      error: error.message,
    });
  }
};

// @desc    Get sync status (pending records count, last sync, etc.)
// @route   GET /api/sync/status
// @access  Private
export const getSyncStatus = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required',
      });
    }
    
    // Get counts from various tables for mobile sync tracking
    const [
      totalFarmers,
      totalPurchases,
      totalBales,
      totalRebales,
      totalTransports,
      totalFarmerLoans,
    ] = await Promise.all([
      db.Farmer.count(),
      db.Purchase.count(),
      db.Bale.count(),
      db.Rebale.count(),
      db.Transport.count(),
      db.FarmerLoan.count(),
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalFarmers,
        totalPurchases,
        totalBales,
        totalRebales,
        totalTransports,
        totalFarmerLoans,
        lastSync: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Sync status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting sync status',
      error: error.message,
    });
  }
};

// @desc    Download only specific tables (for partial sync)
// @route   POST /api/sync/download-partial
// @access  Private
export const downloadPartial = async (req, res) => {
  try {
    const { userId, locationId, tables = [] } = req.body;
    
    if (!userId || !locationId) {
      return res.status(400).json({
        success: false,
        message: 'userId and locationId are required',
      });
    }
    
    const allLocationIds = await getAllChildLocationIds(locationId);
    const result = {};
    
    for (const table of tables) {
      switch (table) {
        case 'farmers':
          result.farmers = await db.Farmer.findAll({
            where: { locationId: { [Op.in]: allLocationIds } },
          });
          break;
        case 'crops':
          result.crops = await db.Crop.findAll();
          break;
        case 'grades':
          result.grades = await db.Grade.findAll();
          break;
        case 'prices':
          result.prices = await db.CropGradePrice.findAll();
          break;
        case 'loans':
          result.loans = await db.Loan.findAll();
          break;
        case 'locations':
          result.locations = await db.Location.findAll();
          break;
        case 'warehouses':
          result.warehouses = await db.Warehouse.findAll({
            where: { locationId: { [Op.in]: allLocationIds } },
          });
          break;
        default:
          break;
      }
    }
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Partial download error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading partial data',
      error: error.message,
    });
  }
};

export default {
  downloadData,
  uploadData,
  getSyncStatus,
  downloadPartial,
};