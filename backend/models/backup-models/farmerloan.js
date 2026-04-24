// import { DataTypes } from 'sequelize';

// export default function(sequelize) {
//   const FarmerLoan = sequelize.define('FarmerLoan', {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     farmerId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'farmers',
//         key: 'id',
//       },
//     },
//     loanId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'loans',
//         key: 'id',
//       },
//     },
//     quantity: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false,
//     },
//     totalAmount: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false,
//     },
//     remainingDebt: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false,
//     },
//     issuedDate: {
//       type: DataTypes.DATEONLY,
//       allowNull: false,
//     },
//   }, {
//     tableName: 'farmer_loans',
//     timestamps: true,
//   });

//   return FarmerLoan;
// }
import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const FarmerLoan = sequelize.define('FarmerLoan', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    farmerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'farmers',
        key: 'id',
      },
    },
    loanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'loans',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    remainingDebt: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    issuedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'defaulted'),
      allowNull: false,
      defaultValue: 'active',
    },
  }, {
    tableName: 'farmer_loans',
    timestamps: true,
  });

  return FarmerLoan;
}