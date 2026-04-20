// backend/migrations/XXXXX-alter-transport-rebales-for-mobile-sync.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transport_rebales_new', {
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
      INSERT INTO transport_rebales_new
      SELECT 
        CAST(id AS CHAR),
        NULL, NULL,
        CAST(transportId AS CHAR),
        CAST(rebaleId AS CHAR),
        loadedAt,
        'web', NULL,
        createdAt, updatedAt
      FROM transport_rebales
    `);

    await queryInterface.dropTable('transport_rebales');
    await queryInterface.renameTable('transport_rebales_new', 'transport_rebales');

    await queryInterface.addIndex('transport_rebales', ['transportId']);
    await queryInterface.addIndex('transport_rebales', ['rebaleId']);
    await queryInterface.addIndex('transport_rebales', ['originalDeviceId', 'originalLocalId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.createTable('transport_rebales_old', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      transportId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'transports',
          key: 'id'
        }
      },
      rebaleId: {
        type: Sequelize.INTEGER,
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
      INSERT INTO transport_rebales_old
      SELECT 
        CAST(id AS UNSIGNED),
        CAST(transportId AS UNSIGNED),
        CAST(rebaleId AS UNSIGNED),
        loadedAt,
        createdAt, updatedAt
      FROM transport_rebales
      WHERE id REGEXP '^[0-9]+$'
    `);

    await queryInterface.dropTable('transport_rebales');
    await queryInterface.renameTable('transport_rebales_old', 'transport_rebales');
  }
};