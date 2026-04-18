import { db } from '.././models/index.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// Get all purchases
export const getAllPurchases = async (req, res) => {
  try {
    const { startDate, endDate, farmerId, buyerId } = req.query;

    const where = {};
    if (startDate) where.purchaseDate = { [Op.gte]: new Date(startDate) };
    if (endDate) {
      where.purchaseDate = where.purchaseDate || {};
      where.purchaseDate[Op.lte] = new Date(endDate);
    }
    if (farmerId) where.farmerId = farmerId;
    if (buyerId) where.buyerId = buyerId;

    const purchases = await db.Purchase.findAll({
      where,
      include: [
        {
          model: db.Farmer,
          attributes: ['id', 'firstName', 'lastName', 'code'],
        },
        {
          model: db.User,
          as: 'buyer',
          attributes: ['id', 'firstName', 'lastName', 'code'],
        },
        {
          model: db.LoanDeduction,
          attributes: ['id', 'deductedAmount', 'createdAt'],
        },
      ],
      order: [['purchaseDate', 'DESC']],
    });

    res.json({
      success: true,
      data: purchases,
      total: purchases.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchases',
      error: error.message,
    });
  }
};

// Get purchase by ID
export const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const purchase = await db.Purchase.findByPk(id, {
      include: [
        {
          model: db.Farmer,
          attributes: ['id', 'firstName', 'lastName', 'code', 'phone'],
        },
        {
          model: db.User,
          as: 'buyer',
          attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
        },
        {
          model: db.Warehouse,
          attributes: ['id', 'name', 'code'],
        },
        {
          model: db.LoanDeduction,
          attributes: ['id', 'amount', 'createdAt'],
        },
      ],
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found',
      });
    }

    res.json({
      success: true,
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchase',
      error: error.message,
    });
  }
};

// Create purchase
export const createPurchase1 = async (req, res) => {
  try {
    const { farmerId, totalMass, totalAmount, loanDeduction, farmerLoanId, warehouseId } = req.body;

    if (!farmerId || !totalMass || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Farmer ID, total mass, and total amount are required',
      });
    }

    // Verify farmer exists
    const farmer = await db.Farmer.findByPk(farmerId);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found',
      });
    }

    const buyerId = req.user.id;
    const netAmount = totalAmount - (loanDeduction || 0);
    const receiptNumber = `PUR-${Date.now()}`;

    // Create purchase record
    const newPurchase = await db.Purchase.create({
      id: uuidv4(),
      receiptNumber,
      farmerId,
      buyerId,
      totalMass,
      totalAmount,
      loanDeducted: loanDeduction || 0,
      amountPaid: netAmount,
      warehouseId: warehouseId || req.user.warehouseId || null,
      purchaseDate: new Date(),
    });

    // If there's a loan deduction, record it
    if (loanDeduction && loanDeduction > 0 && farmerLoanId) {
      // Get current farmer loan
      const loan = await db.FarmerLoan.findByPk(farmerLoanId);
      if (loan) {
        const newRemaining = loan.remainingAmount - loanDeduction;

        // Update remaining amount
        await loan.update({
          remainingAmount: Math.max(0, newRemaining),
          status: newRemaining <= 0 ? 'completed' : 'active',
        });

        // Record the deduction
        await db.LoanDeduction.create({
          id: uuidv4(),
          farmerLoanId,
          purchaseId: newPurchase.id,
          amount: loanDeduction,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Purchase created successfully',
      data: newPurchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create purchase',
      error: error.message,
    });
  }
};
// Create purchase WITH bales (TRANSACTION SAFE)
export const createPurchase2 = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      farmerId,
      totalMass,
      totalAmount,
      loanDeduction,
      farmerLoanId,
      warehouseId,
      bales,
    } = req.body;

    if (!farmerId || !totalMass || !totalAmount) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: 'Farmer ID, total mass, and total amount are required',
      });
    }

    if (!bales || bales.length === 0) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: 'At least one bale is required',
      });
    }

    // Verify farmer exists
    const farmer = await db.Farmer.findByPk(farmerId);

    if (!farmer) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: 'Farmer not found',
      });
    }

    const buyerId = req.user.id;

    const netAmount =
      totalAmount - (loanDeduction || 0);

    const receiptNumber =
      `PUR-${Date.now()}`;

    /*
    CREATE PURCHASE
    */

    const newPurchase =
      await db.Purchase.create(
        {
          id: uuidv4(),
          receiptNumber,
          farmerId,
          buyerId,
          totalMass,
          totalAmount,
          loanDeducted: loanDeduction || 0,
          amountPaid: netAmount,
          warehouseId:
            warehouseId ||
            req.user.warehouseId ||
            null,
          purchaseDate: new Date(),
        },
        { transaction }
      );

    /*
    CREATE BALES
    */

    const baleRecords =
      bales.map((b) => ({
        baleTag: b.baleTag,
        purchaseId: newPurchase.id,
        cropId: b.cropId,
        gradeId: b.gradeId,
        mass: b.mass,
        price: b.price,
        totalAmount: b.totalAmount,
        warehouseId:
          warehouseId ||
          req.user.warehouseId,
        status: 'purchased',
      }));

    await db.Bale.bulkCreate(
      baleRecords,
      { transaction }
    );

    /*
    LOAN DEDUCTION
    */

    if (
      loanDeduction > 0 &&
      farmerLoanId
    ) {
      const loan =
        await db.FarmerLoan.findByPk(
          farmerLoanId,
          { transaction }
        );

      if (loan) {
        const newRemaining =
          loan.remainingAmount -
          loanDeduction;

        await loan.update(
          {
            remainingAmount:
              Math.max(
                0,
                newRemaining
              ),
            status:
              newRemaining <= 0
                ? 'completed'
                : 'active',
          },
          { transaction }
        );

        await db.LoanDeduction.create(
          {
            id: uuidv4(),
            farmerLoanId,
            purchaseId:
              newPurchase.id,
            amount:
              loanDeduction,
          },
          { transaction }
        );
      }
    }

    /*
    COMMIT
    */

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message:
        'Purchase and bales created successfully',
      data: newPurchase,
    });

  } catch (error) {

    await transaction.rollback();

    return res.status(500).json({
      success: false,
      message:
        'Failed to create purchase',
      error: error.message,
    });
  }
};
// ==============================
// CREATE PURCHASE
// ==============================
// This controller:
// 1) Creates Purchase
// 2) Creates PurchaseBales
// 3) Deducts loan automatically
// 4) Updates remainingDebt safely
// 5) Creates LoanDeduction record
// 6) Uses DB transaction for safety

export const createPurchase = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      farmerId,
      buyerId,
      warehouseId,
      purchaseDate,
      totalAmount,
      numberOfBales,
      totalMass,
      loanDeducted,
      farmerLoanId,
      status,
      bales,
      receiptNumber,
      clerkId,
      amountPaid,
    } = req.body;

    // ==============================
    // VALIDATION
    // ==============================

    if (!farmerId) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: 'farmerId is required',
      });
    }

    if (!bales || !Array.isArray(bales) || bales.length === 0) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: 'At least one bale is required',
      });
    }

    // ==============================
    // CREATE PURCHASE
    // ==============================

    const purchase = await db.Purchase.create(
      {
        // id: uuidv4(),
        farmerId,
        buyerId,
        warehouseId,
        purchaseDate,
        totalAmount,
        numberOfBales,
        totalMass,
        receiptNumber,
        clerkId,
        amountPaid,
        loanDeducted: loanDeducted || 0,
        status: status || 'completed',
      },
      { transaction }
    );

    // ==============================
    // CREATE BALES
    // ==============================

    for (const bale of bales) {
      await db.Bale.create(
        {
          // id: uuidv4(),
          purchaseId: purchase.id,
          baleTag: bale.baleTag,
          cropId: bale.cropId,
          gradeId: bale.gradeId,
          mass: bale.mass,
          price: bale.price,
          totalAmount: bale.totalAmount,
          warehouseId: warehouseId,
        },
        { transaction }
      );
    }

    // ==============================
    // LOAN DEDUCTION LOGIC
    // ==============================

    if (farmerLoanId && loanDeducted > 0) {
      const loan = await db.FarmerLoan.findByPk(
        farmerLoanId,
        { transaction }
      );

      if (!loan) {
        await transaction.rollback();

        return res.status(404).json({
          success: false,
          message: 'Farmer loan not found',
        });
      }

      const currentDebt = Number(loan.remainingDebt);

      // SAFETY: never deduct more than remaining debt
      const safeDeduction = Math.min(
        currentDebt,
        Number(loanDeducted)
      );

      const newRemainingDebt = currentDebt - safeDeduction;

      // ==============================
      // UPDATE LOAN
      // ==============================

      await loan.update(
        {
          remainingDebt: newRemainingDebt < 0 ? 0 : newRemainingDebt,

          status:
            newRemainingDebt <= 0
              ? 'completed'
              : 'active',
        },
        { transaction }
      );

      // ==============================
      // CREATE LOAN DEDUCTION RECORD
      // ==============================

      await db.LoanDeduction.create(
        {
          // id: uuidv4(),
          purchaseId: purchase.id,
          farmerLoanId: farmerLoanId,
          deductedAmount: safeDeduction,
          deductionDate: purchaseDate || new Date(),
        },
        { transaction }
      );
    }

    // ==============================
    // COMMIT TRANSACTION
    // ==============================

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: 'Purchase created successfully',
      data: purchase,
    });
  } catch (error) {
    console.error('CREATE PURCHASE ERROR:', error);

    await transaction.rollback();

    return res.status(500).json({
      success: false,
      message: 'Failed to create purchase',
      error: error.message,
    });
  }
};


// Update purchase
export const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const purchase = await db.Purchase.findByPk(id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found',
      });
    }

    await purchase.update(updates);

    res.json({
      success: true,
      message: 'Purchase updated successfully',
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update purchase',
      error: error.message,
    });
  }
};

// Delete purchase
export const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    const purchase = await db.Purchase.findByPk(id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found',
      });
    }

    // Delete associated loan deductions first
    await db.LoanDeduction.destroy({
      where: { purchaseId: id },
    });

    // Delete purchase
    await purchase.destroy();

    res.json({
      success: true,
      message: 'Purchase deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete purchase',
      error: error.message,
    });
  }
};

// Get purchase statistics
export const getPurchaseStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate) where.purchaseDate = { [Op.gte]: new Date(startDate) };
    if (endDate) {
      where.purchaseDate = where.purchaseDate || {};
      where.purchaseDate[Op.lte] = new Date(endDate);
    }

    const purchases = await db.Purchase.findAll({ where });

    const stats = {
      totalPurchases: purchases.length,
      totalMass: purchases.reduce((sum, p) => sum + (p.totalMass || 0), 0),
      totalAmount: purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0),
      totalLoanDeductions: purchases.reduce((sum, p) => sum + (p.loanDeduction || 0), 0),
      totalNetAmount: purchases.reduce((sum, p) => sum + (p.netAmount || 0), 0),
      uniqueFarmers: new Set(purchases.map(p => p.farmerId)).size,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch purchase statistics',
      error: error.message,
    });
  }
};
