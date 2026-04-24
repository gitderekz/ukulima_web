
// --->backend/models/farmerloan.js (Modified)
import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const FarmerLoan = sequelize.define('FarmerLoan', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    farmerId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'farmers',
        key: 'id',
      },
    },
    loanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'loans',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    remainingDebt: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    issuedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'defaulted'),
      allowNull: false,
      defaultValue: 'active',
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
    tableName: 'farmer_loans',
    timestamps: true,
  });

  return FarmerLoan;
}
