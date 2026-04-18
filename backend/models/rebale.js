import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Rebale = sequelize.define('Rebale', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rebaleTag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    rebaleDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('stored', 'transported'),
      allowNull: false,
      defaultValue: 'stored',
    },
  }, {
    tableName: 'rebales',
    timestamps: true,
  });

  return Rebale;
}