// =====================================================
// MIGRATION FILES - FRESH TABLES WITH NO DATA COPYING
// =====================================================

// --->backend/migrations/XXXXXXXXXXXXXX-modify-loan-deductions-for-mobile-sync.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('loan_deductions', { cascade: true });
    
    await queryInterface.createTable('loan_deductions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(50)
      },
      purchaseId: {
        type: Sequelize.STRING(50),
        allowNull: false,
        references: {
          model: 'purchases',
          key: 'id'
        }
      },
      farmerLoanId: {
        type: Sequelize.STRING(50),
        allowNull: false,
        references: {
          model: 'farmer_loans',
          key: 'id'
        }
      },
      deductedAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      deductionDate: {
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

    await queryInterface.addIndex('loan_deductions', ['originalDeviceId', 'originalLocalId']);
    await queryInterface.addIndex('loan_deductions', ['syncSource']);
    await queryInterface.addIndex('loan_deductions', ['purchaseId']);
    await queryInterface.addIndex('loan_deductions', ['farmerLoanId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('loan_deductions');
  }
};