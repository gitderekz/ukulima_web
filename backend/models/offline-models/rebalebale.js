
// --->backend/models/rebalebale.js (Modified)
import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const RebaleBale = sequelize.define('RebaleBale', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    rebaleId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'rebales',
        key: 'id',
      },
    },
    baleId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'bales',
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
    tableName: 'rebale_bales',
    timestamps: true,
  });

  return RebaleBale;
}
