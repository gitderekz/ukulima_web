
// --->backend/migrations/XXXXXXXXXXXXXX-modify-purchases-for-mobile-sync.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('purchases', { cascade: true });
    
    await queryInterface.createTable('purchases', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(50)
      },
      receiptNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      farmerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'farmers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      buyerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      clerkId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      warehouseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'id'
        }
      },
      totalMass: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      loanDeducted: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      amountPaid: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      purchaseDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
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

    await queryInterface.addIndex('purchases', ['originalDeviceId', 'originalLocalId']);
    await queryInterface.addIndex('purchases', ['syncSource']);
    await queryInterface.addIndex('purchases', ['farmerId']);
    await queryInterface.addIndex('purchases', ['receiptNumber']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('purchases');
  }
};
