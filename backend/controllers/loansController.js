import { db } from '.././models/index.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// Get all farmer loans
export const getAllLoans = async (req, res) => {
  try {
    const loans = await db.Loan.findAll({
      // include: [
      //   {
      //     model: db.Farmer,
      //     attributes: ['id', 'firstName', 'lastName', 'code', 'phone'],
      //   },
      //   {
      //     model: db.LoanDeduction,
      //     attributes: ['id', 'deductedAmount', 'createdAt'],
      //   },
      // ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: loans,
      total: loans.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch loans',
      error: error.message,
    });
  }
};

// Get loan by ID
export const getLoanById = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await db.FarmerLoan.findByPk(id, {
      include: [
        {
          model: db.Farmer,
          attributes: ['id', 'firstName', 'lastName', 'code', 'phone', 'email'],
        },
        {
          model: db.LoanDeduction,
          attributes: ['id', 'amount', 'purchaseId', 'createdAt'],
        },
      ],
    });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found',
      });
    }

    res.json({
      success: true,
      data: loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch loan',
      error: error.message,
    });
  }
};

// Create loan for farmer
export const createLoan = async (req, res) => {
  try {
    const { farmerId, loanAmount, interestRate, description } = req.body;

    if (!farmerId || loanAmount == null) {
      return res.status(400).json({
        success: false,
        message: 'Farmer ID and loan amount are required',
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

    const newLoan = await db.FarmerLoan.create({
      id: uuidv4(),
      farmerId,
      loanAmount,
      remainingAmount: loanAmount,
      interestRate: interestRate || 0,
      description: description || null,
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Loan created successfully',
      data: newLoan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create loan',
      error: error.message,
    });
  }
};

// Update loan
export const updateLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const { loanAmount, interestRate, description, status } = req.body;

    const loan = await db.FarmerLoan.findByPk(id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found',
      });
    }

    await loan.update({
      loanAmount: loanAmount || loan.loanAmount,
      interestRate: interestRate !== undefined ? interestRate : loan.interestRate,
      description: description !== undefined ? description : loan.description,
      status: status || loan.status,
    });

    res.json({
      success: true,
      message: 'Loan updated successfully',
      data: loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update loan',
      error: error.message,
    });
  }
};

// Delete loan
export const deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await db.FarmerLoan.findByPk(id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found',
      });
    }

    await loan.destroy();

    res.json({
      success: true,
      message: 'Loan deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete loan',
      error: error.message,
    });
  }
};

// Get farmer loans
export const getFarmerLoans = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const loans = await db.FarmerLoan.findAll({
      where: { farmerId },
      include: [
        {
          model: db.LoanDeduction,
          attributes: ['id', 'amount', 'purchaseId', 'createdAt'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: loans,
      total: loans.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch farmer loans',
      error: error.message,
    });
  }
};

// Assign loan to farmer
export const assignLoanToFarmer = async (req, res) => {
  try {
    const { farmerId, loanAmount, interestRate } = req.body;

    if (!farmerId || loanAmount == null) {
      return res.status(400).json({
        success: false,
        message: 'Farmer ID and loan amount are required',
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

    const newLoan = await db.FarmerLoan.create({
      id: uuidv4(),
      farmerId,
      loanAmount,
      remainingAmount: loanAmount,
      interestRate: interestRate || 0,
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Loan assigned to farmer successfully',
      data: newLoan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to assign loan to farmer',
      error: error.message,
    });
  }
};

// Deduct from loan
export const deductFromLoan = async (req, res) => {
  try {
    const { farmerLoanId, amount, purchaseId } = req.body;

    if (!farmerLoanId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Farmer loan ID and amount are required',
      });
    }

    // Get current farmer loan
    const loan = await db.FarmerLoan.findByPk(farmerLoanId);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Farmer loan not found',
      });
    }

    const newRemaining = loan.remainingAmount - amount;

    // Update remaining amount
    await loan.update({
      remainingAmount: Math.max(0, newRemaining),
      status: newRemaining <= 0 ? 'completed' : 'active',
    });

    // Record the deduction
    const deduction = await db.LoanDeduction.create({
      id: uuidv4(),
      farmerLoanId,
      purchaseId: purchaseId || null,
      amount,
    });

    res.json({
      success: true,
      message: 'Loan deduction recorded successfully',
      data: deduction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to record loan deduction',
      error: error.message,
    });
  }
};
