import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Transport = sequelize.define('Transport', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    receiptNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    rebaleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    origin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'locatons',
        key: 'id',
      },
    },
    destination: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'locatons',
        key: 'id',
      },
    },
    transportDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  }, {
    tableName: 'transports',
    timestamps: true,
  });

  return Transport;
}