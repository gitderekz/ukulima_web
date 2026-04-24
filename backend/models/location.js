import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Location = sequelize.define('Location', {
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
    type: {
      type: DataTypes.ENUM('country', 'region', 'cpp', 'extension', 'zone', 'district', 'ward', 'village', 'street'),
      allowNull: false,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'locations',
        key: 'id',
      },
    },
  }, {
    tableName: 'locations',
    timestamps: true,
  });

  return Location;
}