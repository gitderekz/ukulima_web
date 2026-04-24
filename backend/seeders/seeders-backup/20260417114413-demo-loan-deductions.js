'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('loan_deductions', [
      { id: 1, purchaseId: 2, farmerLoanId: 1, deductedAmount: 90000, deductionDate: '2026-04-12', createdAt: new Date('2026-04-12'), updatedAt: new Date('2026-04-12') },
      { id: 2, purchaseId: 2, farmerLoanId: 2, deductedAmount: 5000, deductionDate: '2026-04-12', createdAt: new Date('2026-04-12'), updatedAt: new Date('2026-04-12') },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('loan_deductions', null, {});
  }
};