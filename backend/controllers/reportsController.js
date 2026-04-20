import { db } from '.././models/index.js';
import { Op } from 'sequelize';
import sequelize from 'sequelize';

// Generate purchases report
export const generatePurchasesReport = async (req, res) => {
  try {
    const { startDate, endDate, locationId, buyerId } = req.query;

    const where = {};
    if (startDate) where.purchaseDate = { [Op.gte]: new Date(startDate) };
    if (endDate) {
      where.purchaseDate = where.purchaseDate || {};
      where.purchaseDate[Op.lte] = new Date(endDate);
    }

    const purchases = await db.Purchase.findAll({
      where,
      include: [
        {
          model: db.Farmer,
          attributes: ['id', 'firstName', 'lastName', 'code', 'locationId'],
          include: [
            {
              model: db.Location,
              attributes: ['id', 'name', 'type'],
            },
          ],
        },
        {
          model: db.User,
          as: 'buyer',
          attributes: ['id', 'firstName', 'lastName', 'username'],
        },
        {
          model: db.LoanDeduction,
          attributes: ['id', 'deductedAmount'],
        },
      ],
      order: [['purchaseDate', 'DESC']],
    });

    // Filter by location if provided
    let filteredPurchases = purchases;
    if (locationId) {
      filteredPurchases = purchases.filter(p => p.Farmer?.locationId === locationId);
    }

    // Filter by buyer if provided
    if (buyerId) {
      filteredPurchases = filteredPurchases.filter(p => p.buyerId === buyerId);
    }

    // Calculate summary
    const summary = {
      totalPurchases: filteredPurchases.length,
      totalMass: filteredPurchases.reduce((sum, p) => sum + (p.totalMass || 0), 0),
      totalAmount: filteredPurchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0),
      totalLoanDeductions: filteredPurchases.reduce((sum, p) => sum + (p.loanDeduction || 0), 0),
      totalNetAmount: filteredPurchases.reduce((sum, p) => sum + (p.netAmount || 0), 0),
      uniqueFarmers: new Set(filteredPurchases.map(p => p.farmerId)).size,
    };

    res.json({
      success: true,
      data: { purchases: filteredPurchases, summary },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate purchases report',
      error: error.message,
    });
  }
};

// Generate rebales report
export const generateRebalesReport = async (req, res) => {
  try {
    const { startDate, endDate, warehouseId } = req.query;

    const where = {};
    if (startDate) where.rebaleDate = { [Op.gte]: new Date(startDate) };
    if (endDate) {
      where.rebaleDate = where.rebaleDate || {};
      where.rebaleDate[Op.lte] = new Date(endDate);
    }
    if (warehouseId) where.warehouseId = warehouseId;

    const rebales = await db.Rebale.findAll({
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
        {
          model: db.User,
          attributes: ['id', 'firstName', 'lastName', 'username'],
        },
      ],
      order: [['rebaleDate', 'DESC']],
    });

    const summary = {
      totalRebales: rebales.length,
      totalMass: rebales.reduce((sum, r) => sum + (r.totalMass || 0), 0),
      totalAmount: rebales.reduce((sum, r) => sum + (r.totalAmount || 0), 0),
    };

    res.json({
      success: true,
      data: { rebales, summary },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate rebales report',
      error: error.message,
    });
  }
};

// Generate transports report
export const generateTransportsReport = async (req, res) => {
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
          as: 'origin',
          attributes: ['id', 'name', 'type'],
        },
        {
          model: db.Location,
          as: 'destination',
          attributes: ['id', 'name', 'type'],
        },
        {
          model: db.User,
          attributes: ['id', 'firstName', 'lastName', 'username'],
        },
      ],
      order: [['transportDate', 'DESC']],
    });

    const summary = {
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
      data: { transports, summary },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate transports report',
      error: error.message,
    });
  }
};

// Generate farmers report
export const generateFarmersReport = async (req, res) => {
  try {
    const { locationId } = req.query;

    const where = {};
    if (locationId) where.locationId = locationId;

    const farmers = await db.Farmer.findAll({
      where,
      include: [
        {
          model: db.Location,
          attributes: ['id', 'name', 'type'],
        },
        {
          model: db.FarmerLoan,
          attributes: ['id', 'loanAmount', 'remainingAmount', 'status'],
        },
        {
          model: db.Purchase,
          attributes: ['id', 'totalMass', 'totalAmount', 'purchaseDate'],
        },
      ],
    });

    // Calculate summary
    const summary = {
      totalFarmers: farmers.length,
      farmersWithDebt: farmers.filter(f => f.FarmerLoans?.some(fl => fl.status === 'active')).length,
      totalDebt: farmers.reduce(
        (sum, f) => sum + (f.FarmerLoans?.reduce((s, fl) => s + (fl.status === 'active' ? fl.remainingAmount : 0), 0) || 0),
        0
      ),
      totalPurchaseMass: farmers.reduce((sum, f) => sum + (f.Purchases?.reduce((s, p) => s + (p.totalMass || 0), 0) || 0), 0),
      totalPurchaseAmount: farmers.reduce((sum, f) => sum + (f.Purchases?.reduce((s, p) => s + (p.totalAmount || 0), 0) || 0), 0),
    };

    res.json({
      success: true,
      data: { farmers, summary },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate farmers report',
      error: error.message,
    });
  }
};

// Generate loans report
export const generateLoansReport = async (req, res) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status) where.status = status;

    const farmerLoans = await db.FarmerLoan.findAll({
      where,
      include: [
        {
          model: db.Farmer,
          attributes: ['id', 'firstName', 'lastName', 'code'],
        },
        {
          model: db.LoanDeduction,
          attributes: ['id', 'deductedAmount', 'createdAt'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const summary = {
      totalLoans: farmerLoans.length,
      activeLoans: farmerLoans.filter(fl => fl.status === 'active').length,
      completedLoans: farmerLoans.filter(fl => fl.status === 'completed').length,
      totalLoanAmount: farmerLoans.reduce((sum, fl) => sum + (fl.loanAmount || 0), 0),
      totalRemaining: farmerLoans
        .filter(fl => fl.status === 'active')
        .reduce((sum, fl) => sum + (fl.remainingAmount || 0), 0),
      totalPaidOff: farmerLoans.reduce((sum, fl) => sum + ((fl.loanAmount || 0) - (fl.remainingAmount || 0)), 0),
    };

    res.json({
      success: true,
      data: { farmerLoans, summary },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate loans report',
      error: error.message,
    });
  }
};

// Generate dashboard statistics
export const generateDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    // Today's purchases
    const todayPurchases = await db.Purchase.findAll({
      where: {
        purchaseDate: {
          [Op.gte]: today,
        },
      },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'amount'],
      ],
      raw: true,
    });

    // This month's purchases
    const monthPurchases = await db.Purchase.findAll({
      where: {
        purchaseDate: {
          [Op.gte]: thisMonth,
        },
      },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'amount'],
      ],
      raw: true,
    });

    // Active loans
    const activeLoans = await db.FarmerLoan.findAll({
      where: { status: 'active' },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('remainingAmount')), 'amount'],
      ],
      raw: true,
    });

    // Total farmers
    const totalFarmersCount = await db.Farmer.count();

    // Pending rebales
    const pendingRebales = await db.Rebale.count({
      where: { status: 'completed' },
    });

    res.json({
      success: true,
      data: {
        todayPurchases: {
          count: todayPurchases[0]?.count || 0,
          amount: todayPurchases[0]?.amount || 0,
        },
        monthPurchases: {
          count: monthPurchases[0]?.count || 0,
          amount: monthPurchases[0]?.amount || 0,
        },
        activeLoans: {
          count: activeLoans[0]?.count || 0,
          amount: activeLoans[0]?.amount || 0,
        },
        totalFarmers: totalFarmersCount,
        pendingRebales,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate dashboard statistics',
      error: error.message,
    });
  }
};
