'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('crop_grade_prices', {
      fields: ['cropId'],
      type: 'foreign key',
      name: 'fk_crop_grade_prices_cropId',
      references: {
        table: 'crops',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('crop_grade_prices', {
      fields: ['gradeId'],
      type: 'foreign key',
      name: 'fk_crop_grade_prices_gradeId',
      references: {
        table: 'grades',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('crop_grade_prices', 'fk_crop_grade_prices_cropId');
    await queryInterface.removeConstraint('crop_grade_prices', 'fk_crop_grade_prices_gradeId');
  }
};