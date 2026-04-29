'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('crops', [
      { id: 1, name: 'Tobacco', code: 'TOB', description: 'Virginia tobacco leaf', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 2, name: 'Cotton', code: 'COT', description: 'Premium cotton', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 3, name: 'Coffee', code: 'COF', description: 'Arabica coffee beans', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('crops', null, {});
  }
};