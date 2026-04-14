import { db } from '../db/database.js';

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

    // Get all child location IDs for filtering
    const allLocationIds = db._getAllChildLocationIds(locationId);

    // Fetch all data (filtered by location where applicable)
    const [
      locations,
      warehouses,
      farmers,
      crops,
      grades,
      cropGradePrices,
      loans,
      farmerLoans,
      settings,
    ] = await Promise.all([
      db.locations.findAll(),
      db.warehouses.findAll(),
      db.farmers.findAll(),
      db.crops.findAll(),
      db.grades.findAll(),
      db.cropGradePrices.findAll(),
      db.loans.findAll(),
      db.farmerLoans.findAll(),
      db.settings.get(),
    ]);

    // Filter farmers by location
    const filteredFarmers = farmers.filter((f) => allLocationIds.includes(f.locationId));

    // Filter farmer loans by farmer location
    const farmerIds = filteredFarmers.map((f) => f.id);
    const filteredFarmerLoans = farmerLoans.filter((fl) => farmerIds.includes(fl.farmerId));

    res.status(200).json({
      success: true,
      data: {
        locations,
        warehouses,
        farmers: filteredFarmers,
        crops,
        grades,
        cropGradePrices,
        loans,
        farmerLoans: filteredFarmerLoans,
        settings,
      },
    });
  } catch (error) {
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
export const uploadData = async (req, res) => {
  try {
    const {
      userId,
      purchases = [],
      bales = [],
      rebales = [],
      transports = [],
      farmerLoans = [],
      loanDeductions = [],
      errorLogs = [],
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required',
      });
    }

    const summary = {
      purchases: 0,
      bales: 0,
      rebales: 0,
      transports: 0,
      farmerLoans: 0,
      loanDeductions: 0,
      errorLogs: 0,
      total: 0,
    };

    const errors = [];

    // Validate and insert purchases
    if (purchases.length > 0) {
      try {
        await db.purchases.bulkCreate(purchases);
        summary.purchases = purchases.length;
      } catch (error) {
        errors.push({ entity: 'purchases', error: error.message });
      }
    }

    // Validate and insert bales
    if (bales.length > 0) {
      try {
        await db.bales.bulkCreate(bales);
        summary.bales = bales.length;
      } catch (error) {
        errors.push({ entity: 'bales', error: error.message });
      }
    }

    // Validate and insert rebales
    if (rebales.length > 0) {
      try {
        await db.rebales.bulkCreate(rebales);
        summary.rebales = rebales.length;
      } catch (error) {
        errors.push({ entity: 'rebales', error: error.message });
      }
    }

    // Validate and insert transports
    if (transports.length > 0) {
      try {
        await db.transports.bulkCreate(transports);
        summary.transports = transports.length;
      } catch (error) {
        errors.push({ entity: 'transports', error: error.message });
      }
    }

    // Validate and insert farmer loans
    if (farmerLoans.length > 0) {
      try {
        await db.farmerLoans.bulkCreate(farmerLoans);
        summary.farmerLoans = farmerLoans.length;

        // Update farmer debts
        for (const loan of farmerLoans) {
          const farmer = await db.farmers.findById(loan.farmerId);
          if (farmer) {
            await db.farmers.update(farmer.id, {
              totalDebt: farmer.totalDebt + loan.totalAmount,
            });
          }
        }
      } catch (error) {
        errors.push({ entity: 'farmerLoans', error: error.message });
      }
    }

    // Insert loan deductions
    if (loanDeductions.length > 0) {
      try {
        for (const deduction of loanDeductions) {
          await db.loanDeductions.create(deduction);
        }
        summary.loanDeductions = loanDeductions.length;
      } catch (error) {
        errors.push({ entity: 'loanDeductions', error: error.message });
      }
    }

    // Log errors from mobile app
    if (errorLogs.length > 0) {
      try {
        for (const log of errorLogs) {
          await db.auditLogs.create({
            userId: log.userId || userId,
            action: 'MOBILE_ERROR',
            entityType: 'error',
            entityId: 'mobile',
            details: log.message,
            ipAddress: req.ip || req.connection.remoteAddress,
          });
        }
        summary.errorLogs = errorLogs.length;
      } catch (error) {
        errors.push({ entity: 'errorLogs', error: error.message });
      }
    }

    summary.total =
      summary.purchases +
      summary.bales +
      summary.rebales +
      summary.transports +
      summary.farmerLoans +
      summary.loanDeductions +
      summary.errorLogs;

    // Create audit log
    await db.auditLogs.create({
      userId,
      action: 'SYNC_UPLOAD',
      entityType: 'sync',
      entityId: userId,
      details: `Synced ${summary.total} records from mobile app`,
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some data failed to sync',
        summary,
        errors,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data synced successfully',
      summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading data',
      error: error.message,
    });
  }
};

export default {
  downloadData,
  uploadData,
};
