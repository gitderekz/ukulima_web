
// --->backend/migrations/XXXXXXXXXXXXXX-modify-rebale-bales-for-mobile-sync.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('rebale_bales', { cascade: true });
    
    await queryInterface.createTable('rebale_bales', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(50)
      },
      rebaleId: {
        type: Sequelize.STRING(50),
        allowNull: false,
        references: {
          model: 'rebales',
          key: 'id'
        }
      },
      baleId: {
        type: Sequelize.STRING(50),
        allowNull: false,
        references: {
          model: 'bales',
          key: 'id'
        }
      },
      sourceBaleIds: {
        type: Sequelize.TEXT,
        allowNull: true
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

    await queryInterface.addIndex('rebale_bales', ['originalDeviceId', 'originalLocalId']);
    await queryInterface.addIndex('rebale_bales', ['syncSource']);
    await queryInterface.addIndex('rebale_bales', ['rebaleId']);
    await queryInterface.addIndex('rebale_bales', ['baleId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rebale_bales');
  }
};
