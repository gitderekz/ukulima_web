import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const CropGradePrice = sequelize.define('CropGradePrice', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    effectiveDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  }, {
    tableName: 'crop_grade_prices',
    timestamps: true,
  });

  return CropGradePrice;
}