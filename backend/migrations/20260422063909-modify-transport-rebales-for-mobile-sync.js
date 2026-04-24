
// --->backend/migrations/XXXXXXXXXXXXXX-modify-transport-rebales-for-mobile-sync.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('transport_rebales', { cascade: true });
    
    await queryInterface.createTable('transport_rebales', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(50)
      },
      transportId: {
        type: Sequelize.STRING(50),
        allowNull: false,
        references: {
          model: 'transports',
          key: 'id'
        }
      },
      rebaleId: {
        type: Sequelize.STRING(50),
        allowNull: false,
        references: {
          model: 'rebales',
          key: 'id'
        }
      },
      loadedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
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

    await queryInterface.addIndex('transport_rebales', ['originalDeviceId', 'originalLocalId']);
    await queryInterface.addIndex('transport_rebales', ['syncSource']);
    await queryInterface.addIndex('transport_rebales', ['transportId']);
    await queryInterface.addIndex('transport_rebales', ['rebaleId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transport_rebales');
  }
};
