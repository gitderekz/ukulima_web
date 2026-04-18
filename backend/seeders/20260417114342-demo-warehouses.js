'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('warehouses', [
      { id: 1, name: 'Arusha Central Warehouse', code: 'WH-001', locationId: 9, capacity: 50000, currentStock: 12500, createdAt: new Date('2024-01-01'), updatedAt: new Date('2026-04-13') },
      { id: 2, name: 'Moshi Main Warehouse', code: 'WH-002', locationId: 11, capacity: 40000, currentStock: 8200, createdAt: new Date('2024-01-01'), updatedAt: new Date('2026-04-13') },
      { id: 3, name: 'Meru Storage', code: 'WH-003', locationId: 10, capacity: 30000, currentStock: 5600, createdAt: new Date('2024-01-01'), updatedAt: new Date('2026-04-13') },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('warehouses', null, {});
  }
};