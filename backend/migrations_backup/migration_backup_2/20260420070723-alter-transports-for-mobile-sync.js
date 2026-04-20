// backend/migrations/XXXXX-alter-transports-for-mobile-sync.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transports_new', {
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
      receiptNumber: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      driverName: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      driverPhone: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      truckPlate1: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      truckPlate2: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      totalMass: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      buyerId: {
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
      originLocationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'locations',
          key: 'id'
        }
      },
      destinationLocationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'locations',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.ENUM('in_transit', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'in_transit'
      },
      transportDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      arrivalDate: {
        type: Sequelize.DATEONLY,
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
      INSERT INTO transports_new
      SELECT 
        CAST(id AS CHAR),
        NULL, NULL,
        receiptNumber, driverName, driverPhone, truckPlate1, truckPlate2,
        totalMass, totalAmount, buyerId, warehouseId, originLocationId, destinationLocationId,
        status, transportDate, arrivalDate,
        'web', NULL, createdAt, updatedAt
      FROM transports
    `);

    await queryInterface.dropTable('transports');
    await queryInterface.renameTable('transports_new', 'transports');

    await queryInterface.addIndex('transports', ['originalDeviceId', 'originalLocalId']);
    await queryInterface.addIndex('transports', ['syncSource']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.createTable('transports_old', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      receiptNumber: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      driverName: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      driverPhone: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      truckPlate1: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      truckPlate2: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      totalMass: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      buyerId: {
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
      originLocationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'locations',
          key: 'id'
        }
      },
      destinationLocationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'locations',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.ENUM('in_transit', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'in_transit'
      },
      transportDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      arrivalDate: {
        type: Sequelize.DATEONLY,
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
      INSERT INTO transports_old
      SELECT 
        CAST(id AS UNSIGNED),
        receiptNumber, driverName, driverPhone, truckPlate1, truckPlate2,
        totalMass, totalAmount, buyerId, warehouseId, originLocationId, destinationLocationId,
        status, transportDate, arrivalDate,
        createdAt, updatedAt
      FROM transports
      WHERE id REGEXP '^[0-9]+$'
    `);

    await queryInterface.dropTable('transports');
    await queryInterface.renameTable('transports_old', 'transports');
  }
};