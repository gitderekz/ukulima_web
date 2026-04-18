import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Crop = sequelize.define('Crop', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'crops',
    timestamps: true,
  });

  return Crop;
}