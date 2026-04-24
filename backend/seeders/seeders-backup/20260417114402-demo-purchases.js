'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('purchases', [
      { id: 1, receiptNumber: 'RCP-2026-0001', farmerId: 2, buyerId: 2, clerkId: 4, warehouseId: 1, totalMass: 250, totalAmount: 2125000, loanDeducted: 0, amountPaid: 2125000, purchaseDate: '2026-04-10', createdAt: new Date('2026-04-10'), updatedAt: new Date('2026-04-10') },
      { id: 2, receiptNumber: 'RCP-2026-0002', farmerId: 1, buyerId: 2, clerkId: 4, warehouseId: 1, totalMass: 180, totalAmount: 1296000, loanDeducted: 95000, amountPaid: 1201000, purchaseDate: '2026-04-12', createdAt: new Date('2026-04-12'), updatedAt: new Date('2026-04-12') },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('purchases', null, {});
  }
};