'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('farmer_loans', [
      { id: 1, farmerId: 2, loanId: 1, quantity: 5, totalAmount: 250.00, remainingDebt: 250.00, issuedDate: '2026-01-15', createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15') },
      { id: 2, farmerId: 3, loanId: 2, quantity: 6, totalAmount: 180.00, remainingDebt: 180.00, issuedDate: '2026-02-01', createdAt: new Date('2026-02-01'), updatedAt: new Date('2026-02-01') },
      { id: 3, farmerId: 4, loanId: 3, quantity: 2, totalAmount: 90.00, remainingDebt: 90.00, issuedDate: '2026-02-10', createdAt: new Date('2026-02-10'), updatedAt: new Date('2026-02-10') },
      { id: 4, farmerId: 5, loanId: 1, quantity: 9, totalAmount: 450.00, remainingDebt: 450.00, issuedDate: '2026-03-01', createdAt: new Date('2026-03-01'), updatedAt: new Date('2026-03-01') },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('farmer_loans', null, {});
  }
};