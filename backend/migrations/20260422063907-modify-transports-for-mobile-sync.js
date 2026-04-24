
// --->backend/migrations/XXXXXXXXXXXXXX-modify-transports-for-mobile-sync.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('transports', { cascade: true });
    
    await queryInterface.createTable('transports', {
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
      rebaleId: {
        type: Sequelize.STRING(50),
        allowNull: true,
        references: {
          model: 'rebales',
          key: 'id'
        }
      },
      driverName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      driverPhone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      truckPlate1: {
        type: Sequelize.STRING,
        allowNull: false
      },
      truckPlate2: {
        type: Sequelize.STRING,
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

    await queryInterface.addIndex('transports', ['originalDeviceId', 'originalLocalId']);
    await queryInterface.addIndex('transports', ['syncSource']);
    await queryInterface.addIndex('transports', ['receiptNumber']);
    await queryInterface.addIndex('transports', ['rebaleId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transports');
  }
};
