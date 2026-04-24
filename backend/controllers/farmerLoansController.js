import { db } from '../models/index.js';

// Get all farmer loans
export const getAllFarmerLoans = async (req, res) => {
  try {
    const { farmerId } = req.query;
    
    const where = {};
    if (farmerId) where.farmerId = farmerId;

    const farmerLoans = await db.FarmerLoan.findAll({
      where,
      include: [
        {
          model: db.Farmer,
          attributes: ['id', 'firstName', 'lastName', 'code', 'phone'],
        },
        {
          model: db.Loan,
          attributes: ['id', 'name', 'type', 'price', 'unit', 'description'],
        },
        {
          model: db.LoanDeduction,
          attributes: ['id', 'deductedAmount', 'createdAt'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: farmerLoans,
      total: farmerLoans.length,
    });
  } catch (error) {
    console.error('Get all farmer loans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch farmer loans',
      error: error.message,
    });
  }
};

// Get farmer loan by ID
export const getFarmerLoanById = async (req, res) => {
  try {
    const { id } = req.params;

    const farmerLoan = await db.FarmerLoan.findByPk(id, {
      include: [
        {
          model: db.Farmer,
          attributes: ['id', 'firstName', 'lastName', 'code', 'phone'],
        },
        {
          model: db.Loan,
          attributes: ['id', 'name', 'type', 'price', 'unit'],
        },
        {
          model: db.LoanDeduction,
          attributes: ['id', 'deductedAmount', 'createdAt'],
        },
      ],
    });

    if (!farmerLoan) {
      return res.status(404).json({
        success: false,
        message: 'Farmer loan not found',
      });
    }

    res.json({
      success: true,
      data: farmerLoan,
    });
  } catch (error) {
    console.error('Get farmer loan by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch farmer loan',
      error: error.message,
    });
  }
};

// Create farmer loan
export const createFarmerLoan = async (req, res) => {
  try {
    const { farmerId, loanId, quantity, totalAmount, remainingDebt, issuedDate } = req.body;

    if (!farmerId || !loanId || quantity == null || totalAmount == null) {
      return res.status(400).json({
        success: false,
        message: 'Farmer ID, loan ID, quantity, and total amount are required',
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

    // Verify loan type exists
    const loanType = await db.Loan.findByPk(loanId);
    if (!loanType) {
      return res.status(404).json({
        success: false,
        message: 'Loan type not found',
      });
    }

    const newFarmerLoan = await db.FarmerLoan.create({
      farmerId,
      loanId,
      quantity,
      totalAmount,
      remainingDebt: remainingDebt !== undefined ? remainingDebt : totalAmount,
      issuedDate: issuedDate || new Date().toISOString().split('T')[0],
    });

    // Update farmer's total debt
    const currentTotalDebt = parseFloat(farmer.totalDebt || 0);
    await farmer.update({
      totalDebt: currentTotalDebt + totalAmount,
    });

    // Fetch created loan with associations
    const createdLoan = await db.FarmerLoan.findByPk(newFarmerLoan.id, {
      include: [
        {
          model: db.Farmer,
          attributes: ['id', 'firstName', 'lastName', 'code'],
        },
        {
          model: db.Loan,
          attributes: ['id', 'name', 'price', 'unit'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Loan assigned to farmer successfully',
      data: createdLoan,
    });
  } catch (error) {
    console.error('Create farmer loan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign loan to farmer',
      error: error.message,
    });
  }
};

// Update farmer loan
export const updateFarmerLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, totalAmount, remainingDebt, status } = req.body;

    const farmerLoan = await db.FarmerLoan.findByPk(id);

    if (!farmerLoan) {
      return res.status(404).json({
        success: false,
        message: 'Farmer loan not found',
      });
    }

    const oldTotalAmount = farmerLoan.totalAmount;
    const newTotalAmount = totalAmount !== undefined ? totalAmount : oldTotalAmount;

    await farmerLoan.update({
      quantity: quantity !== undefined ? quantity : farmerLoan.quantity,
      totalAmount: newTotalAmount,
      remainingDebt: remainingDebt !== undefined ? remainingDebt : farmerLoan.remainingDebt,
    });

    // Update farmer's total debt if total amount changed
    if (newTotalAmount !== oldTotalAmount) {
      const farmer = await db.Farmer.findByPk(farmerLoan.farmerId);
      const currentTotalDebt = parseFloat(farmer.totalDebt || 0);
      const debtDifference = newTotalAmount - oldTotalAmount;
      await farmer.update({
        totalDebt: currentTotalDebt + debtDifference,
      });
    }

    res.json({
      success: true,
      message: 'Farmer loan updated successfully',
      data: farmerLoan,
    });
  } catch (error) {
    console.error('Update farmer loan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update farmer loan',
      error: error.message,
    });
  }
};

// Delete farmer loan
export const deleteFarmerLoan = async (req, res) => {
  try {
    const { id } = req.params;

    const farmerLoan = await db.FarmerLoan.findByPk(id);

    if (!farmerLoan) {
      return res.status(404).json({
        success: false,
        message: 'Farmer loan not found',
      });
    }

    // Update farmer's total debt
    const farmer = await db.Farmer.findByPk(farmerLoan.farmerId);
    const currentTotalDebt = parseFloat(farmer.totalDebt || 0);
    await farmer.update({
      totalDebt: Math.max(0, currentTotalDebt - farmerLoan.totalAmount),
    });

    // Delete associated loan deductions first
    await db.LoanDeduction.destroy({ where: { farmerLoanId: id } });

    await farmerLoan.destroy();

    res.json({
      success: true,
      message: 'Farmer loan deleted successfully',
    });
  } catch (error) {
    console.error('Delete farmer loan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete farmer loan',
      error: error.message,
    });
  }
};