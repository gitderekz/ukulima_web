import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const LoanDeduction = sequelize.define('LoanDeduction', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    purchaseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'purchases',
        key: 'id',
      },
    },
    farmerLoanId: {
      type: DataTypes.INTEGER,
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
  }, {
    tableName: 'loan_deductions',
    timestamps: true,
  });

  return LoanDeduction;
}