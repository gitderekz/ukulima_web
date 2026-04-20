// 'use strict';

// export default {
//   async up(queryInterface, Sequelize) {
//     // 1. Create transport_rebales table
//     await queryInterface.createTable('transport_rebales', {
//       id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       transportId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'transports',
//           key: 'id',
//         },
//         onDelete: 'CASCADE',
//       },
//       rebaleId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'rebales',
//           key: 'id',
//         },
//         onDelete: 'CASCADE',
//       },
//       loadedAt: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.NOW,
//       },
//       createdAt: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.NOW,
//       },
//       updatedAt: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.NOW,
//       },
//     });

//     // Add unique constraint
//     await queryInterface.addConstraint('transport_rebales', {
//       fields: ['transportId', 'rebaleId'],
//       type: 'unique',
//       name: 'unique_transport_rebale',
//     });

//     // 2. Remove transportId from rebales (if exists)
//     const rebalesTable = await queryInterface.describeTable('rebales');
//     if (rebalesTable.transportId) {
//       await queryInterface.removeColumn('rebales', 'transportId');
//     }

//     // 3. Add arrivalDate to transports (if not exists)
//     const transportsTable = await queryInterface.describeTable('transports');
//     if (!transportsTable.arrivalDate) {
//       await queryInterface.addColumn('transports', 'arrivalDate', {
//         type: Sequelize.DATEONLY,
//         allowNull: true,
//       });
//     }

//     // 4. Update enum for rebales.status
//     await queryInterface.changeColumn('rebales', 'status', {
//       type: Sequelize.ENUM('stored', 'transported', 'completed', 'pending'),
//       allowNull: false,
//       defaultValue: 'stored',
//     });
//   },

//   async down(queryInterface, Sequelize) {
//     // rollback changes

//     await queryInterface.dropTable('transport_rebales');

//     await queryInterface.addColumn('rebales', 'transportId', {
//       type: Sequelize.INTEGER,
//       allowNull: true,
//     });

//     await queryInterface.removeColumn('transports', 'arrivalDate');

//     await queryInterface.changeColumn('rebales', 'status', {
//       type: Sequelize.ENUM('stored', 'transported', 'pending'),
//       allowNull: false,
//       defaultValue: 'stored',
//     });
//   },
// };
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create transport_rebales table
    await queryInterface.createTable('transport_rebales', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      transportId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'transports',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      rebaleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'rebales',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      loadedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add unique constraint (transportId + rebaleId)
    await queryInterface.addConstraint('transport_rebales', {
      fields: ['transportId', 'rebaleId'],
      type: 'unique',
      name: 'unique_transport_rebale',
    });

    // 2. Remove transportId from rebales (if exists)
    const rebalesTable = await queryInterface.describeTable('rebales');
    if (rebalesTable.transportId) {
      await queryInterface.removeColumn('rebales', 'transportId');
    }

    // 3. Add arrivalDate to transports (if not exists)
    const transportsTable = await queryInterface.describeTable('transports');
    if (!transportsTable.arrivalDate) {
      await queryInterface.addColumn('transports', 'arrivalDate', {
        type: Sequelize.DATEONLY,
        allowNull: true,
      });
    }

    // 4. Update ENUM for rebales.status
    await queryInterface.changeColumn('rebales', 'status', {
      type: Sequelize.ENUM('stored', 'transported', 'completed', 'pending'),
      allowNull: false,
      defaultValue: 'stored',
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback

    await queryInterface.dropTable('transport_rebales');

    // Add back transportId to rebales
    await queryInterface.addColumn('rebales', 'transportId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // Remove arrivalDate from transports
    const transportsTable = await queryInterface.describeTable('transports');
    if (transportsTable.arrivalDate) {
      await queryInterface.removeColumn('transports', 'arrivalDate');
    }

    // Revert ENUM (remove 'completed')
    await queryInterface.changeColumn('rebales', 'status', {
      type: Sequelize.ENUM('stored', 'transported', 'pending'),
      allowNull: false,
      defaultValue: 'stored',
    });
  },
};