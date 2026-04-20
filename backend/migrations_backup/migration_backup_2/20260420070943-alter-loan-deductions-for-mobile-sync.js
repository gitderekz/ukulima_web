// backend/migrations/XXXXX-alter-loan-deductions-for-mobile-sync.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('loan_deductions_new', {
      id: {
        type: Sequelize.STRING(50),
        primaryKey: true,
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
      syncSource: {
        type: Sequelize.ENUM('web', 'mobile'),
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

    await queryInterface.sequelize.query(`
      INSERT INTO loan_deductions_new
      SELECT 
        CAST(id AS CHAR),
        NULL, NULL,
        CAST(purchaseId AS CHAR),
        CAST(farmerLoanId AS CHAR),
        deductedAmount, deductionDate,
        'web', NULL, createdAt, updatedAt
      FROM loan_deductions
    `);

    await queryInterface.dropTable('loan_deductions');
    await queryInterface.renameTable('loan_deductions_new', 'loan_deductions');

    await queryInterface.addIndex('loan_deductions', ['purchaseId']);
    await queryInterface.addIndex('loan_deductions', ['farmerLoanId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.createTable('loan_deductions_old', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      purchaseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'purchases',
          key: 'id'
        }
      },
      farmerLoanId: {
        type: Sequelize.INTEGER,
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.sequelize.query(`
      INSERT INTO loan_deductions_old
      SELECT 
        CAST(id AS UNSIGNED),
        CAST(purchaseId AS UNSIGNED),
        CAST(farmerLoanId AS UNSIGNED),
        deductedAmount, deductionDate,
        createdAt, updatedAt
      FROM loan_deductions
      WHERE id REGEXP '^[0-9]+$'
    `);

    await queryInterface.dropTable('loan_deductions');
    await queryInterface.renameTable('loan_deductions_old', 'loan_deductions');
  }
};