'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add foreign key for purchaseId
    await queryInterface.addConstraint('bales', {
      fields: ['purchaseId'],
      type: 'foreign key',
      name: 'fk_bales_purchaseId',
      references: {
        table: 'purchases',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Add foreign key for cropId
    await queryInterface.addConstraint('bales', {
      fields: ['cropId'],
      type: 'foreign key',
      name: 'fk_bales_cropId',
      references: {
        table: 'crops',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Add foreign key for gradeId
    await queryInterface.addConstraint('bales', {
      fields: ['gradeId'],
      type: 'foreign key',
      name: 'fk_bales_gradeId',
      references: {
        table: 'grades',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    // Add foreign key for warehouseId
    await queryInterface.addConstraint('bales', {
      fields: ['warehouseId'],
      type: 'foreign key',
      name: 'fk_bales_warehouseId',
      references: {
        table: 'warehouses',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('bales', 'fk_bales_purchaseId');
    await queryInterface.removeConstraint('bales', 'fk_bales_cropId');
    await queryInterface.removeConstraint('bales', 'fk_bales_gradeId');
    await queryInterface.removeConstraint('bales', 'fk_bales_warehouseId');
  }
};