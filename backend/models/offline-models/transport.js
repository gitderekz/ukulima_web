
// --->backend/models/transport.js (Modified)
import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Transport = sequelize.define('Transport', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    receiptNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    rebaleId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'rebales',
        key: 'id',
      },
    },
    driverName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    driverPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    truckPlate1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    truckPlate2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalMass: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    buyerId: {
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
    originLocationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'locations',
        key: 'id',
      },
    },
    destinationLocationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'locations',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('in_transit', 'delivered', 'cancelled'),
      allowNull: false,
      defaultValue: 'in_transit',
    },
    transportDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    arrivalDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
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
    tableName: 'transports',
    timestamps: true,
  });

  return Transport;
}
