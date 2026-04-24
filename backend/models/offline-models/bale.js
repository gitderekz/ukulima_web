
// --->backend/models/bale.js (Modified)
import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Bale = sequelize.define('Bale', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    baleTag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    purchaseId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'purchases',
        key: 'id',
      },
    },
    cropId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'crops',
        key: 'id',
      },
    },
    gradeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'grades',
        key: 'id',
      },
    },
    mass: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'warehouses',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('purchased', 'rebaled', 'transported'),
      allowNull: false,
      defaultValue: 'purchased',
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
    tableName: 'bales',
    timestamps: true,
  });

  return Bale;
}
