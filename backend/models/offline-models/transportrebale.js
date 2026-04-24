
// --->backend/models/transportrebale.js (Modified)
import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const TransportRebale = sequelize.define('TransportRebale', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    transportId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'transports',
        key: 'id',
      },
    },
    rebaleId: {
      type: DataTypes.STRING(50),
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
    tableName: 'transport_rebales',
    timestamps: true,
  });

  return TransportRebale;
}
