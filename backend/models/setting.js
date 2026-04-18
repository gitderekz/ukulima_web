import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Setting = sequelize.define('Setting', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    deductionPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    primaryColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#22c55e',
    },
    secondaryColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#3b82f6',
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'en',
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'TZS',
    },
  }, {
    tableName: 'settings',
    timestamps: false,
    updatedAt: 'updatedAt',
  });

  return Setting;
}