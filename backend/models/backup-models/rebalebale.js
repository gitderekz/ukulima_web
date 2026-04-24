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
  }, {
    tableName: 'rebale_bales',
    timestamps: true,
  });

  return RebaleBale;
}