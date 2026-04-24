'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('bales', [
      { id: 1, baleTag: 'BL-2026-0001', purchaseId: 1, cropId: 1, gradeId: 1, mass: 50, price: 8500, totalAmount: 425000, warehouseId: 1, status: 'purchased', createdAt: new Date('2026-04-10'), updatedAt: new Date('2026-04-10') },
      { id: 2, baleTag: 'BL-2026-0002', purchaseId: 1, cropId: 1, gradeId: 1, mass: 50, price: 8500, totalAmount: 425000, warehouseId: 1, status: 'purchased', createdAt: new Date('2026-04-10'), updatedAt: new Date('2026-04-10') },
      { id: 3, baleTag: 'BL-2026-0003', purchaseId: 1, cropId: 1, gradeId: 2, mass: 75, price: 7200, totalAmount: 540000, warehouseId: 1, status: 'purchased', createdAt: new Date('2026-04-10'), updatedAt: new Date('2026-04-10') },
      { id: 4, baleTag: 'BL-2026-0004', purchaseId: 1, cropId: 1, gradeId: 2, mass: 75, price: 7200, totalAmount: 540000, warehouseId: 1, status: 'rebaled', createdAt: new Date('2026-04-10'), updatedAt: new Date('2026-04-11') },
      { id: 5, baleTag: 'BL-2026-0005', purchaseId: 2, cropId: 1, gradeId: 2, mass: 90, price: 7200, totalAmount: 648000, warehouseId: 1, status: 'purchased', createdAt: new Date('2026-04-12'), updatedAt: new Date('2026-04-12') },
      { id: 6, baleTag: 'BL-2026-0006', purchaseId: 2, cropId: 1, gradeId: 2, mass: 90, price: 7200, totalAmount: 648000, warehouseId: 1, status: 'purchased', createdAt: new Date('2026-04-12'), updatedAt: new Date('2026-04-12') },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('bales', null, {});
  }
};