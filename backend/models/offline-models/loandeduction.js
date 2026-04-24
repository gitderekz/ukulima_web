
// --->backend/models/loandeduction.js (Modified)
import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const LoanDeduction = sequelize.define('LoanDeduction', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    purchaseId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'purchases',
        key: 'id',
      },
    },
    farmerLoanId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'farmer_loans',
        key: 'id',
      },
    },
    deductedAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deductionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // Mobile sync tracking columns
    originalDeviceId: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    originalLocalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    syncSource: {
      type: DataTypes.ENUM('web', 'mobile'),
      allowNull: false,
      defaultValue: 'web',
    },
    syncedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'loan_deductions',
    timestamps: true,
  });

  return LoanDeduction;
}