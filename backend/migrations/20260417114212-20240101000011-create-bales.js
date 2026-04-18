'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bales', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      baleTag: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      purchaseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: 'purchases',
        //   key: 'id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      cropId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: 'crops',
        //   key: 'id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      gradeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: 'grades',
        //   key: 'id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      mass: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      warehouseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: 'warehouses',
        //   key: 'id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('purchased', 'rebaled', 'transported'),
        allowNull: false,
        defaultValue: 'purchased'
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bales');
  }
};