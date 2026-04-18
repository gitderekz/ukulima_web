'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('transports', [
      { id: 1, receiptNumber: 'TRP-2026-0001', rebaleId: 2, driverName: 'Michael Otieno', driverPhone: '+255712345201', truckPlate1: 'T123ABC', truckPlate2: 'T124XYZ', totalMass: 150, totalAmount: 1080000, buyerId: 2, warehouseId: 1, transportDate: '2026-04-12', createdAt: new Date('2026-04-12'), updatedAt: new Date('2026-04-12') },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transports', null, {});
  }
};