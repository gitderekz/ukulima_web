
// --->backend/models/purchase.js (Modified)
import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Purchase = sequelize.define('Purchase', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    receiptNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    farmerId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'farmers',
        key: 'id',
      },
    },
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    clerkId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'warehouses',
        key: 'id',
      },
    },
    totalMass: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    loanDeducted: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    purchaseDate: {
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
    tableName: 'purchases',
    timestamps: true,
  });

  return Purchase;
}
