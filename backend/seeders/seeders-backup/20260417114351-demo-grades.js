'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('grades', [
      { id: 1, name: 'Grade A', code: 'A', description: 'Premium quality - highest grade', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 2, name: 'Grade B', code: 'B', description: 'Good quality', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
      { id: 3, name: 'Grade C', code: 'C', description: 'Standard quality', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('grades', null, {});
  }
};