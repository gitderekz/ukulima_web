
// --->backend/models/rebale.js (Modified)
import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Rebale = sequelize.define('Rebale', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    rebaleTag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    receiptNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
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
    totalMass: {
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
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    sourceBaleIds: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('sourceBaleIds');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue('sourceBaleIds', value ? JSON.stringify(value) : null);
      },
    },
    rebaleDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('stored', 'transported', 'completed', 'pending'),
      allowNull: false,
      defaultValue: 'stored',
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
    tableName: 'rebales',
    timestamps: true,
  });

  return Rebale;
}
