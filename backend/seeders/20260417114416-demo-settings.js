'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('settings', [
      { id: 1, deductionPercentage: 30, primaryColor: '#22c55e', secondaryColor: '#3b82f6', language: 'en', currency: 'TZS', updatedAt: new Date('2024-01-01') },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('settings', null, {});
  }
};