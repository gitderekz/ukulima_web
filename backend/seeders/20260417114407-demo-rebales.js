'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('rebales', [
      { id: 1, rebaleTag: 'RB-2026-0001', cropId: 1, gradeId: 1, totalMass: 100, price: 8500, totalAmount: 850000, warehouseId: 1, buyerId: 2, rebaleDate: '2026-04-11', status: 'stored', createdAt: new Date('2026-04-11'), updatedAt: new Date('2026-04-11') },
      { id: 2, rebaleTag: 'RB-2026-0002', cropId: 1, gradeId: 2, totalMass: 150, price: 7200, totalAmount: 1080000, warehouseId: 1, buyerId: 2, rebaleDate: '2026-04-11', status: 'transported', createdAt: new Date('2026-04-11'), updatedAt: new Date('2026-04-12') },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('rebales', null, {});
  }
};