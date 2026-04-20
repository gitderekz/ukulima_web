// backend/migrations/XXXXX-alter-rebale-bales-for-mobile-sync.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rebale_bales_new', {
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
      INSERT INTO rebale_bales_new
      SELECT 
        CAST(id AS CHAR),
        NULL, NULL,
        CAST(rebaleId AS CHAR),
        CAST(baleId AS CHAR),
        sourceBaleIds,
        'web', NULL,
        createdAt, updatedAt
      FROM rebale_bales
    `);

    await queryInterface.dropTable('rebale_bales');
    await queryInterface.renameTable('rebale_bales_new', 'rebale_bales');

    await queryInterface.addIndex('rebale_bales', ['rebaleId']);
    await queryInterface.addIndex('rebale_bales', ['baleId']);
    await queryInterface.addIndex('rebale_bales', ['originalDeviceId', 'originalLocalId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.createTable('rebale_bales_old', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      rebaleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'rebales',
          key: 'id'
        }
      },
      baleId: {
        type: Sequelize.INTEGER,
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
      INSERT INTO rebale_bales_old
      SELECT 
        CAST(id AS UNSIGNED),
        CAST(rebaleId AS UNSIGNED),
        CAST(baleId AS UNSIGNED),
        sourceBaleIds,
        createdAt, updatedAt
      FROM rebale_bales
      WHERE id REGEXP '^[0-9]+$'
    `);

    await queryInterface.dropTable('rebale_bales');
    await queryInterface.renameTable('rebale_bales_old', 'rebale_bales');
  }
};