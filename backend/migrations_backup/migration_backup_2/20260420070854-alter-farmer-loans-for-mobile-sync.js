// backend/migrations/XXXXX-alter-farmer-loans-for-mobile-sync.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('farmer_loans_new', {
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
      farmerId: {
        type: Sequelize.INTEGER,
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
      INSERT INTO farmer_loans_new
      SELECT 
        CAST(id AS CHAR),
        NULL, NULL,
        farmerId, loanId, quantity, totalAmount, remainingDebt, issuedDate,
        'web', NULL, createdAt, updatedAt
      FROM farmer_loans
    `);

    await queryInterface.dropTable('farmer_loans');
    await queryInterface.renameTable('farmer_loans_new', 'farmer_loans');

    await queryInterface.addIndex('farmer_loans', ['originalDeviceId', 'originalLocalId']);
    await queryInterface.addIndex('farmer_loans', ['farmerId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.createTable('farmer_loans_old', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      farmerId: {
        type: Sequelize.INTEGER,
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
      INSERT INTO farmer_loans_old
      SELECT 
        CAST(id AS UNSIGNED),
        farmerId, loanId, quantity, totalAmount, remainingDebt, issuedDate,
        createdAt, updatedAt
      FROM farmer_loans
      WHERE id REGEXP '^[0-9]+$'
    `);

    await queryInterface.dropTable('farmer_loans');
    await queryInterface.renameTable('farmer_loans_old', 'farmer_loans');
  }
};