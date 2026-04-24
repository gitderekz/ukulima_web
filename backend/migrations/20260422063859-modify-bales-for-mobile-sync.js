
// --->backend/migrations/XXXXXXXXXXXXXX-modify-bales-for-mobile-sync.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('bales', { cascade: true });
    
    await queryInterface.createTable('bales', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(50)
      },
      baleTag: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      purchaseId: {
        type: Sequelize.STRING(50),
        allowNull: false,
        references: {
          model: 'purchases',
          key: 'id'
        }
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
      mass: {
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
      status: {
        type: Sequelize.ENUM('purchased', 'rebaled', 'transported'),
        allowNull: false,
        defaultValue: 'purchased'
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

    await queryInterface.addIndex('bales', ['originalDeviceId', 'originalLocalId']);
    await queryInterface.addIndex('bales', ['syncSource']);
    await queryInterface.addIndex('bales', ['purchaseId']);
    await queryInterface.addIndex('bales', ['baleTag']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bales');
  }
};
