import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const RebaleBale = sequelize.define('RebaleBale', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rebaleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rebales',
        key: 'id',
      },
    },
    baleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bales',
        key: 'id',
      },
    },
  }, {
    tableName: 'rebale_bales',
    timestamps: true,
  });

  return RebaleBale;
}