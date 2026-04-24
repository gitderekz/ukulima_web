
// --->backend/migrations/XXXXXXXXXXXXXX-modify-farmer-loans-for-mobile-sync.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('farmer_loans', { cascade: true });
    
    await queryInterface.createTable('farmer_loans', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(50)
      },
      farmerId: {
        type: Sequelize.STRING(50),
        allowNull: false,
        references: {
          model: 'farmers',
          key: 'id'
        }
      },
      loanId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'loans',
          key: 'id'
        }
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      remainingDebt: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      issuedDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'completed', 'defaulted'),
        allowNull: false,
        defaultValue: 'active'
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

    await queryInterface.addIndex('farmer_loans', ['originalDeviceId', 'originalLocalId']);
    await queryInterface.addIndex('farmer_loans', ['syncSource']);
    await queryInterface.addIndex('farmer_loans', ['farmerId']);
    await queryInterface.addIndex('farmer_loans', ['loanId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('farmer_loans');
  }
};
