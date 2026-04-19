import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const TransportRebale = sequelize.define('TransportRebale', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    transportId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'transports',
        key: 'id',
      },
    },
    rebaleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rebales',
        key: 'id',
      },
    },
    loadedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'transport_rebales',
    timestamps: true,
  });

  return TransportRebale;
}