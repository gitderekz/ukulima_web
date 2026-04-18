import { db } from '.././models/index.js';

// Helper function to get all child location IDs recursively
const getAllChildLocationIds = async (locationId, allIds = []) => {
  allIds.push(locationId);
  const children = await db.Location.findAll({
    where: { parentId: locationId },
    attributes: ['id'],
  });
  
  for (const child of children) {
    await getAllChildLocationIds(child.id, allIds);
  }
  
  return allIds;
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

    // Get all child location IDs for filtering
    const allLocationIds = await getAllChildLocationIds(locationId);

    // Fetch all data (filtered by location where applicable)
    const [
      locations,
      warehouses,
      farmers,
      crops,
      grades,
      prices,
      farmerLoans,
    ] = await Promise.all([
      db.Location.findAll(),
      db.Warehouse.findAll(),
      db.Farmer.findAll(),
      db.Crop.findAll(),
      db.Grade.findAll(),
      db.Price.findAll(),
      db.FarmerLoan.findAll(),
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
        prices,
        farmerLoans: filteredFarmerLoans,
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
      total: 0,
    };

    const errors = [];

    // Validate and insert purchases
    if (purchases.length > 0) {
      try {
        await db.Purchase.bulkCreate(purchases);
        summary.purchases = purchases.length;
      } catch (error) {
        errors.push({ entity: 'purchases', error: error.message });
      }
    }

    // Validate and insert bales
    if (bales.length > 0) {
      try {
        await db.Bale.bulkCreate(bales);
        summary.bales = bales.length;
      } catch (error) {
        errors.push({ entity: 'bales', error: error.message });
      }
    }

    // Validate and insert rebales
    if (rebales.length > 0) {
      try {
        await db.Rebale.bulkCreate(rebales);
        summary.rebales = rebales.length;
      } catch (error) {
        errors.push({ entity: 'rebales', error: error.message });
      }
    }

    // Validate and insert transports
    if (transports.length > 0) {
      try {
        await db.Transport.bulkCreate(transports);
        summary.transports = transports.length;
      } catch (error) {
        errors.push({ entity: 'transports', error: error.message });
      }
    }

    // Validate and insert farmer loans
    if (farmerLoans.length > 0) {
      try {
        await db.FarmerLoan.bulkCreate(farmerLoans);
        summary.farmerLoans = farmerLoans.length;

        // Update farmer debts
        for (const loan of farmerLoans) {
          const farmer = await db.Farmer.findByPk(loan.farmerId);
          if (farmer) {
            farmer.totalDebt = (farmer.totalDebt || 0) + loan.totalAmount;
            await farmer.save();
          }
        }
      } catch (error) {
        errors.push({ entity: 'farmerLoans', error: error.message });
      }
    }

    // Insert loan deductions
    if (loanDeductions.length > 0) {
      try {
        await db.LoanDeduction.bulkCreate(loanDeductions);
        summary.loanDeductions = loanDeductions.length;
      } catch (error) {
        errors.push({ entity: 'loanDeductions', error: error.message });
      }
    }

    summary.total =
      summary.purchases +
      summary.bales +
      summary.rebales +
      summary.transports +
      summary.farmerLoans +
      summary.loanDeductions;

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
    console.error('Upload error:', error);
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
