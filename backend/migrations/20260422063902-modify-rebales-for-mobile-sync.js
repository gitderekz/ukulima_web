
// --->backend/migrations/XXXXXXXXXXXXXX-modify-rebales-for-mobile-sync.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('rebales', { cascade: true });
    
    await queryInterface.createTable('rebales', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(50)
      },
      rebaleTag: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      receiptNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      cropId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'crops',
          key: 'id'
        }
      },
      gradeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'grades',
          key: 'id'
        }
      },
      totalMass: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      warehouseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'id'
        }
      },
      buyerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      sourceBaleIds: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      rebaleDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('stored', 'transported', 'completed', 'pending'),
        allowNull: false,
        defaultValue: 'stored'
      },
      originalDeviceId: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      originalLocalId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      syncSource: {
        type: Sequelize.ENUM('web', 'mobile'),
        allowNull: false,
        defaultValue: 'web'
      },
      syncedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('rebales', ['originalDeviceId', 'originalLocalId']);
    await queryInterface.addIndex('rebales', ['syncSource']);
    await queryInterface.addIndex('rebales', ['rebaleTag']);
    await queryInterface.addIndex('rebales', ['receiptNumber']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rebales');
  }
};
